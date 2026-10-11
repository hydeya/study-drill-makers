import { SubjectConfig, UnitMaster, DrillQuestion } from '../types';

export const SUBJECT_CONFIGS: SubjectConfig[] = [
  {
    id: 'japanese',
    name: '国語',
    shortName: '国',
    themeColor: '#800020',
    lightColor: '#FDF8F9',
    darkColor: '#5C0017',
    badgeColor: 'bg-[#800020] text-white',
    iconEmoji: '📖',
    allowedYears: [1, 2, 3],
    hasKeyboard: false,
  },
  {
    id: 'math',
    name: '数学',
    shortName: '数',
    themeColor: '#007BFF',
    lightColor: '#E6F2FF',
    darkColor: '#0056b3',
    badgeColor: 'bg-[#007BFF] text-white',
    iconEmoji: '🧮',
    allowedYears: [1, 2, 3],
    hasKeyboard: true,
  },
  {
    id: 'english',
    name: '英語',
    shortName: '英',
    themeColor: '#FF8C00',
    lightColor: '#FFF4E6',
    darkColor: '#C76C00',
    badgeColor: 'bg-[#FF8C00] text-white',
    iconEmoji: '🔤',
    allowedYears: [1, 2, 3],
    hasKeyboard: true,
  },
  {
    id: 'science',
    name: '理科',
    shortName: '理',
    themeColor: '#32CD32',
    lightColor: '#F0FFF0',
    darkColor: '#228B22',
    badgeColor: 'bg-[#32CD32] text-white',
    iconEmoji: '🔬',
    allowedYears: [1, 2, 3],
    hasKeyboard: true,
  },
  {
    id: 'geography',
    name: '地理',
    shortName: '地',
    themeColor: '#8B4513',
    lightColor: '#FAF0E6',
    darkColor: '#5C2D0C',
    badgeColor: 'bg-[#8B4513] text-white',
    iconEmoji: '🌍',
    allowedYears: [1, 2], // 中1・中2専用
    hasKeyboard: true,
  },
  {
    id: 'history',
    name: '歴史',
    shortName: '歴',
    themeColor: '#4B0082',
    lightColor: '#F5EEF8',
    darkColor: '#2E004F',
    badgeColor: 'bg-[#4B0082] text-white',
    iconEmoji: '📜',
    allowedYears: [1, 2], // 中1・中2専用
    hasKeyboard: true,
  },
  {
    id: 'civics',
    name: '公民',
    shortName: '公',
    themeColor: '#FF69B4',
    lightColor: '#FFF0F5',
    darkColor: '#C71585',
    badgeColor: 'bg-[#FF69B4] text-white',
    iconEmoji: '🏛️',
    allowedYears: [3], // 中3専用
    hasKeyboard: true,
  },
];

export const ALL_UNITS_MASTER: UnitMaster[] = [
  // ========================= 国語 (東京書籍) =========================
  { id: 'j1-1', subjectId: 'japanese', year: 1, title: '文学的な文章の読解', desc: '場面の移り変わりと情景／登場人物の行動と心情／表現の工夫と主題', format: 'text', category: '現代文' },
  { id: 'j1-2', subjectId: 'japanese', year: 1, title: '説明的な文章の読解', desc: '事実と意見の読み取り／段落相互の関係（要点と要約）／筆者の主張と根拠', format: 'text', category: '現代文' },
  { id: 'j1-3', subjectId: 'japanese', year: 1, title: '古典・漢文の基礎', desc: '竹取物語・故事成語／歴史的仮名遣いと朗読／漢文の基本（書き下し文）', format: 'text', category: '古典・漢文' },
  { id: 'j1-4', subjectId: 'japanese', year: 1, title: '詩歌の鑑賞', desc: '詩の表現（比喩・擬人法）／短歌と俳句の基礎／季語と情景のイメージ', format: 'text', category: '詩歌' },
  { id: 'j1-5', subjectId: 'japanese', year: 1, title: '文法と語彙', desc: '言葉の単位（単語・文節）／単語の分類（品詞の概要）／指示語・接続語の働き', format: 'text', category: '文法' },
  { id: 'j1-6', subjectId: 'japanese', year: 1, title: '漢字・書写', desc: '漢字の読み書き・部首／楷書の筆使い・配列／辞書・事典の使い方', format: 'text', category: '漢字・語彙' },

  { id: 'j2-1', subjectId: 'japanese', year: 2, title: '文学的な文章の読解', desc: '登場人物の心情の変化／情景描写と伏線／主題・背景の読み取り', format: 'text', category: '現代文' },
  { id: 'j2-2', subjectId: 'japanese', year: 2, title: '説明的な文章の読解', desc: '段落の役割と構成／事実と意見の区別／論理の展開（対比・因果）', format: 'text', category: '現代文' },
  { id: 'j2-3', subjectId: 'japanese', year: 2, title: '古典・漢文の基礎', desc: '徒然草・平家物語／歴史的仮名遣いと口語訳／漢文の訓読（返り点）', format: 'text', category: '古典・漢文' },
  { id: 'j2-4', subjectId: 'japanese', year: 2, title: '詩歌の鑑賞', desc: '近代詩の表現技法／短歌／俳句（季語と切れ字）', format: 'text', category: '詩歌' },
  { id: 'j2-5', subjectId: 'japanese', year: 2, title: '文法と語彙', desc: '自立語・付属語／動詞の活用／敬語', format: 'text', category: '文法' },
  { id: 'j2-6', subjectId: 'japanese', year: 2, title: '漢字・書写', desc: '漢字の読み書き／行書の筆使い／四字熟語・故事成語', format: 'text', category: '漢字・語彙' },

  { id: 'j3-1', subjectId: 'japanese', year: 3, title: '文学的な文章の読解', desc: '人物像と心理変化の深掘り／象徴表現と作風／主題の考察と批評', format: 'text', category: '現代文' },
  { id: 'j3-2', subjectId: 'japanese', year: 3, title: '説明的な文章の読解', desc: '論理の構造と段落展開／論拠の妥当性と説得力／文章の批判的吟味・比較読解', format: 'text', category: '現代文' },
  { id: 'j3-3', subjectId: 'japanese', year: 3, title: '古典・漢文の鑑賞', desc: '万葉・古今・新古今和歌集／奥の細道／漢詩の鑑賞と絶句・律詩', format: 'text', category: '古典・漢文' },
  { id: 'j3-4', subjectId: 'japanese', year: 3, title: '詩歌と表現', desc: '現代詩の鑑賞と表現技法／和歌・短歌の表現／俳句の深みと鑑賞', format: 'text', category: '詩歌' },
  { id: 'j3-5', subjectId: 'japanese', year: 3, title: '文法と語彙', desc: '敬語の適切な運用／助動詞・助詞の働きと活用／語彙の拡充・和語・漢語・外来語', format: 'text', category: '文法' },
  { id: 'j3-6', subjectId: 'japanese', year: 3, title: '漢字・表現', desc: '常用漢字の完成・難解語／構成を考慮した作文・小論文／慣用句・四字熟語・故事成語の活用', format: 'text', category: '漢字・語彙' },

  // ========================= 数学 (啓林館) =========================
  { id: 'm1-1', subjectId: 'math', year: 1, title: '正の数・負の数', desc: '数直線／四則計算／正負の数の利用', format: 'text', category: '数と式' },
  { id: 'm1-2', subjectId: 'math', year: 1, title: '文字の式', desc: '文字を使った式と数量の表し方／一次式の計算／関係を表す式', format: 'text', category: '数と式' },
  { id: 'm1-3', subjectId: 'math', year: 1, title: '方程式', desc: '方程式とその解き方／様々な方程式の計算／一次方程式の文章題', format: 'text', category: '方程式' },
  { id: 'm1-4', subjectId: 'math', year: 1, title: '比例と反比例', desc: '変化の割合／比例の性質・グラフ／反比例の性質・グラフ', format: 'text', category: '関数' },
  { id: 'm1-5', subjectId: 'math', year: 1, title: '平面図形', desc: '作図（垂直二等分線・角の二等分線）／図形の移動／扇形の計量', format: 'text', category: '図形' },
  { id: 'm1-6', subjectId: 'math', year: 1, title: '空間図形', desc: '立体の位置関係／表面積と体積／展開図と投影図', format: 'text', category: '図形' },
  { id: 'm1-7', subjectId: 'math', year: 1, title: 'データの活用', desc: '度数分布表とヒストグラム／代表値（平均・中央・最頻）／相対度数', format: 'text', category: 'データ' },

  { id: 'm2-1', subjectId: 'math', year: 2, title: '式の計算', desc: '単項式と多項式の計算／文字式の利用・証明／等式の変形', format: 'text', category: '数と式' },
  { id: 'm2-2', subjectId: 'math', year: 2, title: '連立方程式', desc: '加減法・代入法／連立方程式の文章題（速さ・割合）／グラフ', format: 'text', category: '方程式' },
  { id: 'm2-3', subjectId: 'math', year: 2, title: '一次関数', desc: '変化の割合／グラフと式の決定／一次関数の利用（動点）', format: 'text', category: '関数' },
  { id: 'm2-4', subjectId: 'math', year: 2, title: '平行と合同', desc: '対頂角・平行線の錯角同位角／多角形の内角外角／三角形の合同条件と証明', format: 'text', category: '図形' },
  { id: 'm2-5', subjectId: 'math', year: 2, title: '三角形と四角形', desc: '二等辺・直角三角形／平行四辺形の性質と条件／特別な四角形', format: 'text', category: '図形' },
  { id: 'm2-6', subjectId: 'math', year: 2, title: '確率', desc: '樹形図と表／サイコロ・カード・コイン／確率の求め方', format: 'text', category: '確率' },
  { id: 'm2-7', subjectId: 'math', year: 2, title: 'データの比較', desc: '四分位数と箱ひげ図／データ傾向の読み取り／散らばりの比較', format: 'text', category: 'データ' },

  { id: 'm3-1', subjectId: 'math', year: 3, title: '多項式', desc: '多項式の乗法と因数分解／乗法公式／式の計算の利用・証明', format: 'text', category: '数と式' },
  { id: 'm3-2', subjectId: 'math', year: 3, title: '平方根', desc: '平方根の意義と変形／平方根の四則計算／近似値と文章題', format: 'text', category: '数と式' },
  { id: 'm3-3', subjectId: 'math', year: 3, title: '二次方程式', desc: '因数分解・平方完成・解の公式／二次方程式の解法／利用文章題', format: 'text', category: '方程式' },
  { id: 'm3-4', subjectId: 'math', year: 3, title: '関数 y=ax²', desc: '関数 y=ax² の変域／変化の割合と放物線／利用（制動距離・図形）', format: 'text', category: '関数' },
  { id: 'm3-5', subjectId: 'math', year: 3, title: '相似な図形', desc: '相似条件／平行線と線分の比／面積比と体積比の利用', format: 'text', category: '図形' },
  { id: 'm3-6', subjectId: 'math', year: 3, title: '円の性質', desc: '円周角の定理とその逆／円周角の定理の利用・証明／接線と弦', format: 'text', category: '図形' },
  { id: 'm3-7', subjectId: 'math', year: 3, title: '三平方の定理', desc: '三平方の定理とその証明／平面図形への利用／空間図形への利用', format: 'text', category: '図形' },
  { id: 'm3-8', subjectId: 'math', year: 3, title: '標本調査', desc: '全数調査と標本調査／標本の無作為抽出／母集団の推定', format: 'text', category: 'データ' },

  // ========================= 英語 (東京書籍 NEW HORIZON) =========================
  { id: 'e1-1', subjectId: 'english', year: 1, title: '英語の基礎・be動詞', desc: 'アルファベット・発音／be動詞（am/are/is）／否定文・疑問文／挨拶', format: 'text', category: '文法' },
  { id: 'e1-2', subjectId: 'english', year: 1, title: '一般動詞', desc: '一般動詞の文／三人称単数現在形（-s/-es）／否定文・疑問文（do/does）／複数形', format: 'text', category: '文法' },
  { id: 'e1-3', subjectId: 'english', year: 1, title: '代名詞・疑問詞', desc: '人称代名詞の変化／who/what/where/when／how/which/whose／指示代名詞', format: 'text', category: '文法' },
  { id: 'e1-4', subjectId: 'english', year: 1, title: '助動詞・命令文', desc: '助動詞 can／命令文（肯定・否定）／Let\'s の文／日常動作表現', format: 'text', category: '文法' },
  { id: 'e1-5', subjectId: 'english', year: 1, title: '進行形・過去形', desc: '現在進行形（be + -ing）／be動詞の過去形／一般動詞の過去形（規則・不規則）', format: 'text', category: '文法' },
  { id: 'e1-6', subjectId: 'english', year: 1, title: '感情・提案・文型', desc: '動詞 + to 不定詞／Look + 形容詞／How about ～ ?／まとめと応答', format: 'text', category: '表現' },

  { id: 'e2-1', subjectId: 'english', year: 2, title: '過去・未来', desc: '過去進行形／未来表現（will / be going to）／接続詞', format: 'text', category: '文法' },
  { id: 'e2-2', subjectId: 'english', year: 2, title: '助動詞', desc: '義務・禁止（must/have to）／忠告（should）／依頼・許可（May I/Could you）', format: 'text', category: '文法' },
  { id: 'e2-3', subjectId: 'english', year: 2, title: '動詞の働き', desc: '不定詞の3用法（名詞・形容詞・副詞）／動名詞／第4文型（SVOO）', format: 'text', category: '文法' },
  { id: 'e2-4', subjectId: 'english', year: 2, title: '文型・接続詞', desc: '文型（SVC/SVO/SVOO）／接続詞（when/if/because/though）／動詞+人+to不定詞', format: 'text', category: '文法' },
  { id: 'e2-5', subjectId: 'english', year: 2, title: '比較', desc: '比較級（-er/more）／最上級（-est/most）／原級（as ～ as）／不規則変化', format: 'text', category: '文法' },
  { id: 'e2-6', subjectId: 'english', year: 2, title: '受動態', desc: '受動態の基本（be + 過去分詞）／否定文・疑問文／動作主（by）／過去分詞変化', format: 'text', category: '文法' },

  { id: 'e3-1', subjectId: 'english', year: 3, title: '受動態・現在完了', desc: '受動態の応用／現在完了（継続・経験・完了・結果）', format: 'text', category: '文法' },
  { id: 'e3-2', subjectId: 'english', year: 3, title: '現在完了進行形・不定詞', desc: '現在完了進行形／It is ～ for ... to 不定詞／tell/ask + 人 + to／疑問詞+to不定詞', format: 'text', category: '文法' },
  { id: 'e3-3', subjectId: 'english', year: 3, title: '分詞・関係代名詞', desc: '現在分詞・過去分詞の後置修飾／主格・目的格の関係代名詞（who/which/that）', format: 'text', category: '重要構文' },
  { id: 'e3-4', subjectId: 'english', year: 3, title: '後置修飾・間接疑問', desc: '関係代名詞の省略／間接疑問文／make・call + A + B／SVOC', format: 'text', category: '重要構文' },
  { id: 'e3-5', subjectId: 'english', year: 3, title: '仮定法・総合読解', desc: '仮定法過去（If I were ...）／長文読解の展開／入試頻出重要構文', format: 'text', category: '総合読解' },

  // ========================= 理科 (東京書籍) =========================
  { id: 's1-1', subjectId: 'science', year: 1, title: '植物の生活と種類', desc: '花のつくり／葉・茎・根の構造と光合成・蒸散／植物の分類（種子・胞子）', format: 'text', category: '生物' },
  { id: 's1-2', subjectId: 'science', year: 1, title: '身のまわりの物質', desc: '有機物と無機物／気体の発生と性質／水溶液の溶解度と質量パーセント濃度', format: 'text', category: '化学' },
  { id: 's1-3', subjectId: 'science', year: 1, title: '状態変化', desc: '状態変化と体積・質量／蒸留と沸点／密度（g/cm³）の計算', format: 'text', category: '化学' },
  { id: 's1-4', subjectId: 'science', year: 1, title: '光・音・力', desc: '光の反射・屈折・凸レンズの実像虚像／音の高さと大きさ／力の大きさと圧力（Pa）', format: 'text', category: '物理' },
  { id: 's1-5', subjectId: 'science', year: 1, title: '火山と地震', desc: '火山の形とマグマ・鉱物／地震の初期微動継続時間とP波・S波／プレートテクトニクス', format: 'text', category: '地学' },
  { id: 's1-6', subjectId: 'science', year: 1, title: '地層と地史', desc: '風化・侵食・運搬・堆積／示相化石・示準化石／大地の変動と柱状図', format: 'text', category: '地学' },

  { id: 's2-1', subjectId: 'science', year: 2, title: '化学変化', desc: '熱分解・電気分解／原子記号と化学式／酸化と還元／質量保存の法則', format: 'text', category: '化学' },
  { id: 's2-2', subjectId: 'science', year: 2, title: '生物と細胞・循環', desc: '細胞の観察／消化酵素と栄養の吸収／呼吸と心臓・血液循環', format: 'text', category: '生物' },
  { id: 's2-3', subjectId: 'science', year: 2, title: '刺激と反応・進化', desc: '感覚器官・中枢神経と反射／骨格と筋肉／セキツイ動物の分類と進化・相同器官', format: 'text', category: '生物' },
  { id: 's2-4', subjectId: 'science', year: 2, title: '電気の世界', desc: '直列・並列回路の電流と電圧／オームの法則（V=IR）／電力（W）と熱量（J）', format: 'text', category: '物理' },
  { id: 's2-5', subjectId: 'science', year: 2, title: '磁界と電流', desc: '磁界の向きと磁力線／電流がつくる磁界／電磁誘導と誘導電流・発電', format: 'text', category: '物理' },
  { id: 's2-6', subjectId: 'science', year: 2, title: '天気とその変化', desc: '気圧と風／飽和水蒸気量と湿度・露点／前線（寒冷・温暖）と日本の気象', format: 'text', category: '地学' },

  { id: 's3-1', subjectId: 'science', year: 3, title: '生命の連続性', desc: '体細胞分裂と減数分裂／生殖（有性・無性）／メンデルの遺伝の規則性／DNA', format: 'text', category: '生物' },
  { id: 's3-2', subjectId: 'science', year: 3, title: '化学変化とイオン', desc: '水溶液の電気伝導性／電離式とイオン／酸・アルカリ・中和と塩／ダニエル電池', format: 'text', category: '化学' },
  { id: 's3-3', subjectId: 'science', year: 3, title: '運動とエネルギー', desc: '等速直線運動・慣性の法則／仕事（J）と仕事率（W）／力学的エネルギー保存の法則', format: 'text', category: '物理' },
  { id: 's3-4', subjectId: 'science', year: 3, title: '地球と宇宙', desc: '地球の自転・公転と天体の日周・年周運動／太陽系惑星／月の満ち欠けと金星の満ち欠け', format: 'text', category: '地学' },
  { id: 's3-5', subjectId: 'science', year: 3, title: '自然と環境', desc: '生産者・消費者・分解者と食物連鎖／炭素と窒素の循環／プラスチックと自然保全', format: 'text', category: '環境' },

  // ========================= 地理 (東京書籍・中1・中2専用) =========================
  { id: 'g1-1', subjectId: 'geography', year: 1, title: '世界の姿', desc: '緯度・経度／本初子午線と赤道／六大陸と三大洋／地球儀と世界地図（メルカトル等）', format: 'text', category: '世界地理' },
  { id: 'g1-2', subjectId: 'geography', year: 1, title: '世界の気候と暮らし', desc: '熱帯・乾燥帯・温帯・冷帯・寒帯の雨温図と生活／高山気候の暮らし', format: 'text', category: '世界地理' },
  { id: 'g1-3', subjectId: 'geography', year: 1, title: '世界各地の様子（アジア・欧・ア）', desc: 'アジアの農業と工業成長／ヨーロッパの統合（EU）と混合農業／アフリカの鉱産資源とプランテーション', format: 'text', category: '世界地理' },
  { id: 'g1-4', subjectId: 'geography', year: 1, title: '世界各地の様子（北米・南米・オ）', desc: '北アメリカの適地適作農業／南アメリカの鉱工業と熱帯林保護／オセアニアの多文化社会', format: 'text', category: '世界地理' },
  { id: 'g1-5', subjectId: 'geography', year: 1, title: '日本の姿と領域', desc: '日本の位置・標準時子午線と時差計算／領土・領海・排他的経済水域（EEZ）／北方領土・竹島・尖閣', format: 'text', category: '日本地理' },

  { id: 'g2-1', subjectId: 'geography', year: 2, title: '日本の自然と人口', desc: '日本の山脈・平野・海岸線／気候区分（日本海・太平洋・瀬戸内等）／少子高齢化と過疎・過密', format: 'text', category: '日本地理' },
  { id: 'g2-2', subjectId: 'geography', year: 2, title: '日本の産業と資源', desc: '農業（近郊・促成・抑制）／太平洋ベルトと工業地域／エネルギーと火力・再生可能', format: 'text', category: '日本地理' },
  { id: 'g2-3', subjectId: 'geography', year: 2, title: '九州地方', desc: '亜熱帯気候と台風／シラス台地と畑作・畜産／北九州工業地帯と環境共生都市', format: 'text', category: '日本地理' },
  { id: 'g2-4', subjectId: 'geography', year: 2, title: '中国・四国地方', desc: '瀬戸内の温暖気候と交通網（本州四国連絡橋）／山陰・南四国の過疎化対策／地域連携', format: 'text', category: '日本地理' },
  { id: 'g2-5', subjectId: 'geography', year: 2, title: '近畿地方', desc: '京都・奈良の歴史的遺産と町並み／阪神工業地帯と中小企業／琵琶湖の水資源と保全', format: 'text', category: '日本地理' },
  { id: 'g2-6', subjectId: 'geography', year: 2, title: '中部地方', desc: '東海（中京工業地帯）／中央高地の高冷地農業／北陸の稲作と地場産業', format: 'text', category: '日本地理' },
  { id: 'g2-7', subjectId: 'geography', year: 2, title: '関東地方', desc: '東京大都市圏の政治経済／京浜・京葉工業地域／近郊農業と輸送園芸農業', format: 'text', category: '日本地理' },
  { id: 'g2-8', subjectId: 'geography', year: 2, title: '東北地方', desc: '冷害とやませへの対策／日本屈指の稲作穀倉地帯／伝統工芸品と高速交通網', format: 'text', category: '日本地理' },
  { id: 'g2-9', subjectId: 'geography', year: 2, title: '北海道地方', desc: '冷帯気候と冬の暮らし／大規模畑作・酪農と十勝平野／アイヌ文化の歴史と自然', format: 'text', category: '日本地理' },

  // ========================= 歴史 (東京書籍・中1・中2専用) =========================
  { id: 'h1-1', subjectId: 'history', year: 1, title: '人類の出現と古代文明', desc: '旧石器・新石器時代／四大文明（エジプト・メソポタミア・インダス・黄河）／三大宗教の成立', format: 'text', category: '古代' },
  { id: 'h1-2', subjectId: 'history', year: 1, title: '日本のあけぼの', desc: '縄文文化と弥生文化（稲作・金属器）／邪馬台国と卑弥呼／大和王権と前方後円墳', format: 'text', category: '古代' },
  { id: 'h1-3', subjectId: 'history', year: 1, title: '古代国家の歩み', desc: '聖徳太子の政治（冠位十二階・憲法十七条）／大化の改新／大宝律令と平城京／天平文化', format: 'text', category: '古代' },
  { id: 'h1-4', subjectId: 'history', year: 1, title: '平安京と国風文化', desc: '平安京遷都／藤原氏の摂関政治／国風文化（仮名文字・源氏物語）／武士の台頭と平氏の繁栄', format: 'text', category: '古代・中世' },
  { id: 'h1-5', subjectId: 'history', year: 1, title: '鎌倉幕府と武士', desc: '源頼朝の幕府成立／御家人制度と執権政治（北条氏）／御成敗式目／元寇（蒙古襲来）と幕府の衰退', format: 'text', category: '中世' },

  { id: 'h2-1', subjectId: 'history', year: 2, title: '室町幕府と東アジア', desc: '南北朝の動乱と足利尊氏／勘合貿易（日明貿易）／惣村と土一揆／北山文化・東山文化', format: 'text', category: '中世' },
  { id: 'h2-2', subjectId: 'history', year: 2, title: '戦国と天下統一', desc: '応仁の乱と下剋上／鉄砲伝来とキリスト教／織田信長・豊臣秀吉の天下統一（太閤検地・刀狩）', format: 'text', category: '近世' },
  { id: 'h2-3', subjectId: 'history', year: 2, title: '江戸幕府の成立と社会', desc: '関ヶ原の戦いと徳川家康／参勤交代・武家諸法度／鎖国政策と出島／身分秩序（士農工商）', format: 'text', category: '近世' },
  { id: 'h2-4', subjectId: 'history', year: 2, title: '産業の発達と幕府政治', desc: '元禄文化と化政文化／享保・寛政・天保の三大改革／百姓一揆と大塩平八郎の乱', format: 'text', category: '近世' },
  { id: 'h2-5', subjectId: 'history', year: 2, title: '欧米の進出と開国', desc: '産業革命・市民革命／ペリー来航と日米和親・修好通商条約／尊王攘夷運動と倒幕', format: 'text', category: '近代' },
  { id: 'h2-6', subjectId: 'history', year: 2, title: '明治維新と立憲政治', desc: '廃藩置県・地租改正・徴兵令／殖産興業と富国強兵／自由民権運動／大日本帝国憲法の制定', format: 'text', category: '近代' },
  { id: 'h2-7', subjectId: 'history', year: 2, title: '条約改正と近代戦争', desc: '領事裁判権撤廃と関税自主権回復／日清戦争・下関条約／日露戦争・ポーツマス条約／八幡製鉄所', format: 'text', category: '近代' },
  { id: 'h2-8', subjectId: 'history', year: 2, title: '大正デモクラシーと国際', desc: '第一次世界大戦と国際連盟／政党政治の成立／普通選挙法と治安維持法／新しい文化', format: 'text', category: '近代' },
  { id: 'h2-9', subjectId: 'history', year: 2, title: '世界恐慌と第二次大戦', desc: '世界恐慌とニューディール／軍部の台頭と満州事変／日中戦争／太平洋戦争と戦時国民生活', format: 'text', category: '現代' },
  { id: 'h2-10', subjectId: 'history', year: 2, title: '現代の日本と世界', desc: '戦後改革（農地改革・財閥解体）／日本国憲法公布／サンフランシスコ平和条約／高度経済成長', format: 'text', category: '現代' },

  // ========================= 公民 (東京書籍・中3専用) =========================
  { id: 'c3-1', subjectId: 'civics', year: 3, title: '現代社会と文化', desc: '少子高齢化・情報化・グローバル化／持続可能な社会（SDGs）／伝統文化と宗教', format: 'text', category: '現代社会' },
  { id: 'c3-2', subjectId: 'civics', year: 3, title: '人権と日本国憲法', desc: '国民主権・基本的人権の尊重・平和主義（第9条）／自由権・平等権・社会権／新しい人権', format: 'text', category: '憲法・人権' },
  { id: 'c3-3', subjectId: 'civics', year: 3, title: '民主政治と統治機構', desc: '議会制民主主義と選挙制度／国会（唯一の立法機関）／内閣（行政）／裁判所（三権分立・違憲立法審査）／地方自治', format: 'text', category: '政治機構' },
  { id: 'c3-4', subjectId: 'civics', year: 3, title: '市場経済と暮らし', desc: '需要と供給の均衡価格／独占・寡占と公正常任委員会／株式会社と労働者の権利／金融政策と日本銀行', format: 'text', category: '経済' },
  { id: 'c3-5', subjectId: 'civics', year: 3, title: '財政と社会保障', desc: '直接税と間接税／累進課税制度／社会保障の4本柱（社会保険・公的扶助・社会福祉・公衆衛生）／国の借金と財政赤字', format: 'text', category: '財政・福祉' },
  { id: 'c3-6', subjectId: 'civics', year: 3, title: '国際社会と地球課題', desc: '国際連合の組織（総会・安全保障理事会）／地球規模課題（地球温暖化・貧困・難民）／平和と核兵器廃絶への取り組み', format: 'text', category: '国際社会' },
];

import { CURRICULUM_BANK } from './curriculumBank';

// 高品質なバックアップ・シード問題集（文部科学省指導要領・教科書準拠）
export const CURATED_QUESTIONS_MAP: Record<string, DrillQuestion[]> = {
  ...CURRICULUM_BANK,
};

export const UNITS_MASTER = ALL_UNITS_MASTER;
export const CURATED_QUESTIONS = CURATED_QUESTIONS_MAP;

export function getUnitItems(unit: UnitMaster): string[] {
  if (unit.items && unit.items.length > 0) return unit.items;
  return unit.desc.split('／').map((s) => s.trim()).filter(Boolean);
}
