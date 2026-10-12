import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { ALL_UNITS_MASTER, CURATED_QUESTIONS_MAP } from './src/data/units.ts';
import { DrillQuestion, SubjectId, DifficultyLevel } from './src/types.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize Google Gen AI
const apiKey = process.env.GEMINI_API_KEY || '';
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Multi-tier Full-Spec Flash Architecture (速度より品質最優先: Lite完全排除)
// Primary: gemini-3.8-flash (with retry)
// Multi-tier Fallback: gemini-3.7-flash -> gemini-3.6-flash -> gemini-3.5-flash
const PRIMARY_MODEL = 'gemini-3.8-flash';
const FALLBACK_MODELS = ['gemini-3.7-flash', 'gemini-3.6-flash', 'gemini-3.5-flash'];

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper with strict timeout to prevent 504 Gateway Timeouts
async function withTimeout<T>(promise: Promise<T>, ms: number = 8500): Promise<T> {
  let timer: NodeJS.Timeout;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error(`Timeout after ${ms}ms`)), ms);
  });
  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    clearTimeout(timer!);
  }
}

// Helper to shuffle array
function shuffleArray<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Textbook standard mapping
const SUBJECT_TEXTBOOKS: Record<SubjectId, string> = {
  japanese: '東京書籍『新しい国語』',
  math: '啓林館『未来へひろがる数学』',
  english: '東京書籍『NEW HORIZON English Course』',
  science: '東京書籍『新しい理科』',
  geography: '東京書籍『新しい社会 地理分野』',
  history: '東京書籍『新しい社会 歴史分野』',
  civics: '東京書籍『新しい社会 公民分野』',
};

const SUBJECT_NAMES_JP: Record<SubjectId, string> = {
  japanese: '国語',
  math: '数学',
  english: '英語',
  science: '理科',
  geography: '地理',
  history: '歴史',
  civics: '公民',
};

const DIFFICULTY_LABELS: Record<DifficultyLevel, string> = {
  basic: '【純度100% 基礎レベル】教科書基本事項・重要用語・基本公式・平易な一問一答。1ステップで直感的に解ける基礎定着問題。上位学年概念や未習内容は完全封鎖すること。',
  standard: '【純度100% 標準レベル】定期テスト頻出・典型的な解法パターンの適用・標準的文章題。1〜2ステップで解ける典型良問。定期テスト80点・入試基本ラインを確実に仕留める問題。',
  applied: '【純度100% 思考型応用レベル】複数概念の統合・条件整理・動点・理由や因果関係の記述問題。入試発展・高次思考力を問う思考型良問。',
};

// 6大自己監査: 日本字体「問」強制、LaTeX・ドルマーク排除、Unicode特殊記号変換
function sanitizeMathText(text: string): string {
  if (!text) return '';
  return text
    .replace(/问/g, '問') // 字体チェック: 中国簡体字「问」を日本字体「問」へ強制置換
    .replace(/\$([^\$]+)\$/g, '$1') // remove $ ... $
    .replace(/\\times/g, '×')
    .replace(/\\div/g, '÷')
    .replace(/\\pm/g, '±')
    .replace(/\\pi/g, 'π')
    .replace(/\\le|\\leq/g, '≦')
    .replace(/\\ge|\\geq/g, '≧')
    .replace(/\\neq/g, '≠')
    .replace(/\\sqrt\{([^}]+)\}/g, '√$1')
    .replace(/\\sqrt/g, '√')
    .replace(/\^2\b/g, '²')
    .replace(/\^3\b/g, '³')
    .replace(/cm\^2/g, 'cm²')
    .replace(/cm\^3/g, 'cm³')
    .replace(/m\^2/g, 'm²')
    .replace(/m\^3/g, 'm³');
}

// Pre-Output Self-Audit Engine (事後自己監査)
interface AuditResult {
  passed: boolean;
  sanitized: DrillQuestion[];
  issues: string[];
}

function runSelfAudit(
  questions: any[],
  subjectId: SubjectId,
  countNeeded: number
): AuditResult {
  const issues: string[] = [];
  const sanitized: DrillQuestion[] = [];

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    if (!q || typeof q !== 'object') continue;

    let questionText = sanitizeMathText(String(q.question || '').trim());
    let answerText = sanitizeMathText(String(q.answer || '').trim());
    let explanationText = sanitizeMathText(
      String(q.explanation || '文部科学省指導要領に準拠した解説です。').trim()
    );

    if (!questionText || !answerText) {
      issues.push(`問${i + 1}: 問題文または解答が空です`);
      continue;
    }

    const hasOptions = Array.isArray(q.options) && q.options.length >= 4;
    if (hasOptions) {
      let options = q.options.map((opt: any) => sanitizeMathText(String(opt).trim())).filter(Boolean);

      // Choice requirement: exactly 4 unique options
      const uniqueOpts = Array.from(new Set(options));
      if (uniqueOpts.length < 4) {
        issues.push(`問${i + 1}: 4つの独立した選択肢が不足しています`);
        continue;
      }
      options = uniqueOpts.slice(0, 4);

      // Answer must match one of options
      const hasMatch = options.some(
        (opt: string) => opt === answerText || opt.toLowerCase() === answerText.toLowerCase()
      );
      if (!hasMatch) {
        answerText = options[0];
      }

      sanitized.push({
        question: questionText,
        options,
        answer: answerText,
        explanation: explanationText,
      });
    } else {
      sanitized.push({
        question: questionText,
        answer: answerText,
        explanation: explanationText,
      });
    }
  }

  const passed = sanitized.length >= countNeeded;
  return {
    passed,
    sanitized: sanitized.slice(0, countNeeded),
    issues,
  };
}

// Generate fallback questions if AI is unavailable (subject-specific educational phrasing)
function generateSeedFallbackQuestions(
  unit: any,
  item: string,
  count: number,
  choiceCount: number,
  textCount: number
): DrillQuestion[] {
  const subjectId = unit.subjectId as SubjectId;
  const subjectName = SUBJECT_NAMES_JP[subjectId];
  const items = unit.desc.split('／').map((s: string) => s.trim());
  const targetItem = item || items[0] || unit.title;

  const results: DrillQuestion[] = [];

  const getSubjectQuestion = (sub: string, qIdx: number): { q: string; a: string; exp: string } => {
    switch (subjectId) {
      case 'math': {
        const p = [
          { q: `【数学・${unit.title}】${sub}における計算または関係式を正確に答えなさい。`, a: sub, exp: `啓林館『未来へひろがる数学』中${unit.year}の重要公式・解法に基づく問題です。` },
          { q: `【数学・${unit.title}】${sub}の性質を利用して求められる値または関係式を答えなさい。`, a: sub, exp: `基本公式と計算プロセスの確実な定着を問う問題です。` },
          { q: `【数学・${unit.title}】${sub}に関する条件を満たす式または代表的な数値を答えなさい。`, a: sub, exp: `単元の重要事項と計算規則の確認問題です。` },
        ];
        return p[qIdx % p.length];
      }
      case 'english': {
        const p = [
          { q: `【英語・${unit.title}】${sub}の文法規則に従って、適切な英文または語句を答えなさい。`, a: sub, exp: `東京書籍『NEW HORIZON』中${unit.year}の重要文法項目です。` },
          { q: `【英語・${unit.title}】${sub}を用いた表現において、空所または語形変化として適切な語を答えなさい。`, a: sub, exp: `主語の人称・時制や文型の一致に注意して解答します。` },
        ];
        return p[qIdx % p.length];
      }
      case 'science': {
        const p = [
          { q: `【理科・${unit.title}】${sub}の実験・観察において確認される現象や物質名、法則名を答えなさい。`, a: sub, exp: `東京書籍『新しい理科』中${unit.year}の重要観察事項・実験結果です。` },
          { q: `【理科・${unit.title}】${sub}に関する基本原理や、発生する気体・物質の名称を答えなさい。`, a: sub, exp: `因果関係や化学式・物理法則の理解を深める問題です。` },
        ];
        return p[qIdx % p.length];
      }
      case 'geography': {
        const p = [
          { q: `【地理・${unit.title}】${sub}に見られる代表的な地形・気候または産業の特徴を答えなさい。`, a: sub, exp: `東京書籍『新しい社会 地理分野』の重要地域特色・統計事項です。` },
          { q: `【地理・${unit.title}】${sub}に関する都市名、山脈・平野名、または地域課題を答えなさい。`, a: sub, exp: `地図上の位置関係と地域特性の結びつきを確認する問題です。` },
        ];
        return p[qIdx % p.length];
      }
      case 'history': {
        const p = [
          { q: `【歴史・${unit.title}】${sub}に関わる歴史的な事件・法律、または中心となった人物名を答えなさい。`, a: sub, exp: `東京書籍『新しい社会 歴史分野』の時代背景と重要事項です。` },
          { q: `【歴史・${unit.title}】${sub}によってもたらされた社会の変化や政策の名称を答えなさい。`, a: sub, exp: `歴史の流れと原因・結果の因果関係を把握する問題です。` },
        ];
        return p[qIdx % p.length];
      }
      case 'civics': {
        const p = [
          { q: `【公民・${unit.title}】日本国憲法や現代社会において「${sub}」を規定・保障する制度や原則を答えなさい。`, a: sub, exp: `東京書籍『新しい社会 公民分野』の重要憲法条文・社会制度です。` },
          { q: `【公民・${unit.title}】${sub}における仕組みや、国民の権利・義務に関する重要用語を答えなさい。`, a: sub, exp: `民主主義・市場経済・国際社会の基本概念を確認する問題です。` },
        ];
        return p[qIdx % p.length];
      }
      default: {
        const p = [
          { q: `【国語・${unit.title}】${sub}に関する文章読解において、筆者の主張や重要語句として適切なものを答えなさい。`, a: sub, exp: `東京書籍『新しい国語』中${unit.year}の読解・語彙の重要ポイントです。` },
          { q: `【国語・${unit.title}】${sub}における表現技法や文法上の役割、言葉の意味を答えなさい。`, a: sub, exp: `文脈に応じた的確な言葉の運用と読解力を養う問題です。` },
        ];
        return p[qIdx % p.length];
      }
    }
  };

  // 1. 概念定着のための4択問題
  for (let i = 0; i < choiceCount; i++) {
    const subItem = items[i % items.length] || targetItem;
    const itemA = items[(i + 1) % items.length] || '他の概念・用語';
    const itemB = items[(i + 2) % items.length] || '異なる単元の事項';
    const itemC = items[(i + 3) % items.length] || '例外的事項';
    results.push({
      question: `【${subjectName}・${unit.title}】「${subItem}」に関する記述として最も適切なものを1つ選びなさい。（第${i + 1}問）`,
      options: [
        `${subItem}の基本事項`,
        `${itemA}の内容`,
        `${itemB}の内容`,
        `${itemC}の内容`,
      ],
      answer: `${subItem}の基本事項`,
      explanation: `文部科学省指導要領に準拠した${unit.title}（${subItem}）の重要知識です。`,
    });
  }

  // 2. 記述・一問一答問題（主軸）
  for (let i = 0; i < textCount; i++) {
    const qNum = choiceCount + i + 1;
    const subItem = items[(choiceCount + i) % items.length] || targetItem;
    const t = getSubjectQuestion(subItem, i);
    results.push({
      question: `${t.q}（第${qNum}問）`,
      answer: t.a,
      explanation: t.exp,
    });
  }

  return results.slice(0, count);
}

// Endpoint: Generate questions
app.post('/api/drill/generate', async (req: Request, res: Response) => {
  const { unitId, count = 5, level = 'standard', item = '' } = req.body;
  const numCount = Math.min(Math.max(Number(count) || 5, 1), 15);
  const diffLevel: DifficultyLevel = ['basic', 'standard', 'applied'].includes(level)
    ? (level as DifficultyLevel)
    : 'standard';

  const unit = ALL_UNITS_MASTER.find((u) => u.id === unitId);
  if (!unit) {
    res.status(400).json({ error: '無効な単元IDです。' });
    return;
  }

  const subjectName = SUBJECT_NAMES_JP[unit.subjectId];
  const textbook = SUBJECT_TEXTBOOKS[unit.subjectId];
  const diffDesc = DIFFICULTY_LABELS[diffLevel];
  const itemInstruction = item
    ? `特に詳細項目【${item}】を中心とした問題構成にしてください。`
    : `単元範囲（${unit.desc}）からバランス良く出題してください。`;

  // 厳格な配分計算（厳守仕様: 全て4択は絶対禁止。あくまで記述問題を主軸・メインとする）
  let choiceCount = 0;
  if (diffLevel === 'basic') {
    // 基礎: 概念定着のための4択を一部（20〜30%程度）配置。過半数以上（70〜80%）は記述
    choiceCount = Math.max(1, Math.min(Math.floor(numCount * 0.3), 3));
  } else if (diffLevel === 'standard') {
    // 標準: 記述が圧倒的メイン（80〜100%）。選択問題は10問以上で最大1問のみ
    choiceCount = numCount >= 10 ? 1 : 0;
  } else {
    // 応用: 100%記述（思考・論述・計算・長文記述）
    choiceCount = 0;
  }
  const textCount = numCount - choiceCount;

  // Attempt Gemini API with multi-tier failover: 3.8-flash (attempt 1) -> 3.8-flash (retry) -> 3.7-flash -> 3.6-flash -> 3.5-flash
  if (ai) {
    const attempts = [
      { model: PRIMARY_MODEL, timeoutMs: 8500, isRetry: false },
      { model: PRIMARY_MODEL, timeoutMs: 8500, isRetry: true },
      { model: 'gemini-3.7-flash', timeoutMs: 7500, isRetry: false },
      { model: 'gemini-3.6-flash', timeoutMs: 7500, isRetry: false },
      { model: 'gemini-3.5-flash', timeoutMs: 7500, isRetry: false },
    ];

    for (let i = 0; i < attempts.length; i++) {
      const attempt = attempts[i];
      if (attempt.isRetry) {
        await sleep(800);
      }
      const modelName = attempt.model;
      try {
        const prompt = `あなたは文部科学省中学校学習指導要領および${textbook}に精通した優秀な${subjectName}科指導教官「テス」です。
中学${unit.year}年生向け「${unit.title}」に関する演習問題を必ず【合計${numCount}問】作成してください。
${itemInstruction}
難易度設定: ${diffDesc}

【問題形式・出題構成（★記述メイン・ハイブリッド編成）】
- 総出題数: 必ず【${numCount}問】
- 記述・一問一答問題: 必ず【${textCount}問】（重要語句・計算・思考・理由説明・短文記述・英作文など）
- 概念定着のための4択問題: 必ず【${choiceCount}問】（基礎概念・用語の識別。重複のない4つの選択肢を用意）
※【絶対厳守ルール】「すべて4択問題」の出力は絶対に禁止です。生徒の自力アウトプット力・記述力を鍛えるため、記述問題を主軸（${textCount}/${numCount}問）とし、4択問題は概念定着の導入（${choiceCount}問）としてのみ配置してください。${choiceCount === 0 ? '（全問記述問題として作成してください）' : ''}

【厳格な作成＆6大自己監査ルール（★最重要）】
1. 難易度純度100%: 選択された【${diffDesc}】の難易度を100%厳守すること。
2. 未習範囲自動封鎖（最重要）: 中学${unit.year}年生の指定単元より上位の公式・文法・解法（三平方の定理、平方根、二次方程式、現在完了、関係代名詞等）の出題・解説での使用を完全禁止。必ず指定学年の範囲内でのみ作問すること。
3. 字体チェック: 中国簡体字（问）を完全禁止し、必ず日本の字体（問・直・骨・過・遅・海）のみを出力すること。
4. 数式・表記統一: LaTeX記号($)や分数・平方根のコマンドは絶対禁止。必ずUnicode特殊文字（m²・cm²・℃・π・÷・×・√・±・≦・≧・CO₂など）を使用すること。分数は「(2x+3y)/5」、平方根は「√B/A」のように平易なテキスト表記とすること。
5. 問数厳守: 必ず指定された合計【${numCount}問】を出力すること。途中終了は禁止。
6. 教科純度100%: ${subjectName}以外の内容・他教科用語が混入しないこと。
7. 4択問題 (${choiceCount}問): 各問に重複のない4つの選択肢（options）を設け、"answer" は options のいずれか1つと完全一致させること。
8. 記述問題 (${textCount}問): "options" キーは含めない（または空配列にする）こと。"answer" に模範解答を提示し、許容される別解があれば括弧書きで「模範（別解）」のように添えること。
9. 解説の充実: "explanation" には生徒が自力で納得できる教育的根拠・考え方の急所・文末処理の注意点を明記すること。

必ず以下の厳密なJSON配列形式のみで出力してください（Markdownコードブロックや前置きは禁止）：
[
  ${choiceCount > 0 ? `// 4択問題（${choiceCount}問）
  {
    "question": "問題文",
    "options": ["選択肢1", "選択肢2", "選択肢3", "選択肢4"],
    "answer": "正解の選択肢",
    "explanation": "わかりやすい解説"
  },` : ''}
  // 記述問題（${textCount}問）
  {
    "question": "問題文",
    "answer": "模範解答（別解）",
    "explanation": "わかりやすい解説"
  }
]`;

        const apiCall = ai.models.generateContent({
          model: modelName,
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            temperature: 0.6,
            thinkingConfig: { thinkingBudget: 0 },
          },
        });
        const response = await withTimeout(apiCall, attempt.timeoutMs);

        let jsonText = response.text?.trim() || '';
        jsonText = jsonText.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/i, '').trim();

        const parsed = JSON.parse(jsonText);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const audit = runSelfAudit(parsed, unit.subjectId, numCount);
          if (audit.sanitized.length > 0) {
            // If slightly short, supplement with seed questions
            let finalQuestions = audit.sanitized;
            if (finalQuestions.length < numCount) {
              const needed = numCount - finalQuestions.length;
              const seeds = generateSeedFallbackQuestions(unit, item, needed, 0, needed);
              finalQuestions = [...finalQuestions, ...seeds];
            }

            res.json({
              questions: finalQuestions.slice(0, numCount),
              source: 'ai',
              model: modelName,
              audited: true,
            });
            return;
          }
        }
      } catch (err: any) {
        console.warn(`Model attempt [${i + 1}/${attempts.length}] ${modelName} failed:`, err?.message || err);
      }
    }
  }

  // Fallback to high quality curated question bank (Tokyo Shoseki / Keirinkan / New Horizon)
  const curated = CURATED_QUESTIONS_MAP[unitId] || [];
  if (curated.length > 0) {
    const shuffled = shuffleArray(curated);
    if (shuffled.length >= numCount) {
      res.json({
        questions: shuffled.slice(0, numCount),
        source: 'curated',
        model: 'MEXT Curated Bank',
        audited: true,
      });
      return;
    }
    // If fewer than requested, combine curated + procedural
    const needed = numCount - shuffled.length;
    const seeds = generateSeedFallbackQuestions(unit, item, needed, 0, needed);
    res.json({
      questions: [...shuffled, ...seeds],
      source: 'curated',
      model: 'MEXT Curriculum Bank',
      audited: true,
    });
    return;
  }

  // Dynamic seed generator fallback (Descriptive-first)
  const seeds = generateSeedFallbackQuestions(unit, item, numCount, choiceCount, textCount);
  res.json({
    questions: seeds,
    source: 'curated',
    model: 'MEXT Curriculum Bank',
    audited: true,
  });
});

// Endpoint: AI judge answer (meaning-based flexible comparison)
app.post('/api/drill/judge', async (req: Request, res: Response) => {
  const { question, modelAnswer, userAnswer, subjectId = 'japanese' } = req.body;

  if (!userAnswer || !modelAnswer) {
    res.status(400).json({ error: '解答が不足しています。' });
    return;
  }

  // 1. Quick exact or normalized match
  const cleanUser = String(userAnswer).trim().toLowerCase();
  const cleanModel = String(modelAnswer).trim().toLowerCase();

  // Strip parentheses for simple comparison
  const modelBare = cleanModel.replace(/（[^）]*）|\([^)]*\)/g, '').trim();
  const modelAlts = (cleanModel.match(/（([^）]+)）|\(([^)]+)\)/g) || []).map((m) =>
    m.replace(/[（）()]/g, '').trim().toLowerCase()
  );

  // Exact match with bare model or alternative
  if (cleanUser === cleanModel || cleanUser === modelBare || modelAlts.includes(cleanUser)) {
    res.json({
      status: 'correct',
      correct: true,
      points: 5,
      maxPoints: 5,
      rubricEarned: '✔ 模範解答と完全に一致しています（満点）',
      rubricDeducted: '',
      feedback: '模範解答と完全に合致しています！お見事です。',
    });
    return;
  }

  // Normalize spaces and common Japanese variations
  const normalizeText = (t: string) =>
    t
      .replace(/\s+/g, '')
      .replace(/[−ー―]/g, '-')
      .replace(/[✕×]/g, '×')
      .replace(/[÷]/g, '÷')
      .replace(/[，、]/g, ',')
      .replace(/[。．]/g, '.')
      .replace(/co2/gi, 'co₂')
      .replace(/h2o/gi, 'h₂o');

  if (
    cleanUser &&
    (normalizeText(cleanUser) === normalizeText(cleanModel) ||
      normalizeText(cleanUser) === normalizeText(modelBare))
  ) {
    res.json({
      status: 'correct',
      correct: true,
      points: 5,
      maxPoints: 5,
      rubricEarned: '✔ 正解要件を完璧に満たしています（満点）',
      rubricDeducted: '',
      feedback: '完全正解です！要点を的確に捉えられています。',
    });
    return;
  }

  // 2. Gemini semantic 3-tier judging with multi-tier failover (3.8-flash -> retry -> 3.7-flash -> 3.6-flash -> 3.5-flash)
  if (ai) {
    const judgeAttempts = [
      { model: PRIMARY_MODEL, timeoutMs: 4500, isRetry: false },
      { model: PRIMARY_MODEL, timeoutMs: 4500, isRetry: true },
      { model: 'gemini-3.7-flash', timeoutMs: 4000, isRetry: false },
      { model: 'gemini-3.6-flash', timeoutMs: 4000, isRetry: false },
      { model: 'gemini-3.5-flash', timeoutMs: 4000, isRetry: false },
    ];

    for (let i = 0; i < judgeAttempts.length; i++) {
      const attempt = judgeAttempts[i];
      if (attempt.isRetry) {
        await sleep(600);
      }
      const modelName = attempt.model;
      try {
        const subjectName = SUBJECT_NAMES_JP[subjectId as SubjectId] || '各教科';
        const prompt = `あなたは文部科学省中学校学習指導要領を熟知した学習指導講師「テス」です。
生徒（中学生）が入力した記述解答を【3段階（〇 完全正解 / △ 部分点 / ✕ 不正解）】で要素採点してください。

【問題文】: ${question}
【模範解答】: ${cleanModel}
【生徒の解答】: ${cleanUser}
【対象教科】: ${subjectName}

【福井県入試特化・採点基準（配点: 5点満点）】
1. 〇 完全正解（status: "correct", points: 5, correct: true）:
   - 模範解答との一字一句の完全一致は不要。
   - 核心キーワード、理由、因果関係、文末処理（国語「〜こと」「〜から」、理社「〜ため」、数学の単位・立式、英語の語順・時制）が満たされている。
   - 表記ゆれ（ひらがな/漢字、送り仮名）や同値な数式記号（x=5 と 5、CO2 と 二酸化炭素等）は満点。

2. △ 部分点（status: "partial", points: 2〜4, correct: false）:
   - 【重要・複合要素問の必須ルール】「現象名・用語＋その理由や気象状態の説明」のように2つ以上の要素を問う設問で、生徒が1つの要素（例: 用語「フェーン現象」のみ正解、後半は「わからない」や未記述・不十分）を満たしている場合は、絶対に✕にせず【必ず △ 部分点（2〜3点）】と判定してください。
   - 理由や要点の方向性は合っているが、指定語句の抜け、文末処理（〜から、〜ため、〜こと）の不備、理社での因果関係の表現不足、英語の軽微なスペルミスなど、あと一歩惜しい解答もすべて △ 部分点です。
   - rubricEarned: 得点できた要点（例: "✔ 現象名『フェーン現象』を正しく答えられています（+2点）"）
   - rubricDeducted: 減点されたNG例・不足（例: "✖ 気象状態（山を越えて高温乾燥した風が吹き下りること）の説明が抜けています（-3点）"）

3. ✕ 不正解（status: "incorrect", points: 0, correct: false）:
   - 根本的な知識違い、誤った概念、別単元の用語、完全な白紙・無回答。
   - rubricDeducted: 不足している基本概念の指摘。

必ず以下の厳密なJSON形式のみで出力してください（Markdownコードブロックや前置きは禁止）：
{
  "status": "correct" または "partial" または "incorrect",
  "points": 0から5の整数,
  "maxPoints": 5,
  "rubricEarned": "評価された得点要素（空文字可）",
  "rubricDeducted": "減点されたNG要素・改善点（空文字可）",
  "feedback": "テス講師からの具体的で熱い講評アドバイス（1〜2文）"
}`;

        const apiCall = ai.models.generateContent({
          model: modelName,
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            temperature: 0.1,
            thinkingConfig: { thinkingBudget: 0 },
          },
        });

        const response = (await withTimeout(apiCall, attempt.timeoutMs)) as any;

        let jsonText = response.text?.trim() || '';
        jsonText = jsonText.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/i, '').trim();

        const parsed = JSON.parse(jsonText);
        const status = ['correct', 'partial', 'incorrect'].includes(parsed.status)
          ? parsed.status
          : parsed.correct ? 'correct' : 'incorrect';
        const points = Number.isInteger(parsed.points)
          ? parsed.points
          : status === 'correct' ? 5 : status === 'partial' ? 3 : 0;

        res.json({
          status,
          correct: status === 'correct',
          points,
          maxPoints: 5,
          rubricEarned: parsed.rubricEarned || (status === 'correct' ? '✔ 正解要件を満たしています' : ''),
          rubricDeducted: parsed.rubricDeducted || (status === 'incorrect' ? '✖ 模範解答と照合して要点を確認しましょう' : ''),
          feedback:
            parsed.feedback ||
            (status === 'correct'
              ? '正解です！満点です。'
              : status === 'partial'
              ? '惜しい！部分点獲得です。あと一歩で満点！'
              : '不正解です。模範解答を確認しましょう。'),
          model: modelName,
        });
        return;
      } catch (err: any) {
        console.warn(`Judge model attempt [${i + 1}/${judgeAttempts.length}] ${modelName} failed:`, err?.message || err);
      }
    }
  }

  // 3. Local heuristic fallback (3段階判定対応)
  const tokens = modelBare.split(/[\s,、・]+/).filter((t) => t.length > 1);
  const matchedTokens = tokens.filter((t) => cleanUser.includes(t));
  const isMatch =
    cleanUser.length > 0 &&
    (cleanModel.includes(cleanUser) ||
      cleanUser.includes(modelBare) ||
      (tokens.length > 0 && matchedTokens.length >= Math.ceil(tokens.length * 0.7)));

  const isPartial = !isMatch && tokens.length > 0 && matchedTokens.length > 0;
  const status = isMatch ? 'correct' : isPartial ? 'partial' : 'incorrect';

  res.json({
    status,
    correct: status === 'correct',
    points: status === 'correct' ? 5 : status === 'partial' ? 3 : 0,
    maxPoints: 5,
    rubricEarned: status === 'correct' ? '✔ 正解要件を満たしています' : status === 'partial' ? '✔ 一部の重要語句が含まれています（+3点）' : '',
    rubricDeducted: status === 'partial' ? '✖ 文末処理や必要要素が不足しています（-2点）' : status === 'incorrect' ? '✖ 模範解答を確認しましょう' : '',
    feedback: status === 'correct'
      ? '正解と判定しました！要点をしっかり押さえられています。'
      : status === 'partial'
      ? '惜しい！部分点を獲得しました。文末や指定語句を補えば満点です。'
      : '不正解です。模範解答と解説を確認してポイントを覚えましょう。',
  });
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer();
