/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const GAS_URL_STORAGE_KEY = 'study_drill_makers_gas_url';
export const GAS_TOKEN_STORAGE_KEY = 'study_drill_makers_gas_token';
export const GAS_QUEUE_STORAGE_KEY = 'study_drill_makers_gas_pending_queue';

export interface GasConfig {
  url: string;
  token: string;
  isConfigured: boolean;
}

export interface GasDrillPayload {
  timestamp: string; // "YYYY/MM/DD HH:mm" (JST)
  subjectName: string;
  grade: number;
  difficulty: string;
  unitName: string;
  item: string; // 空なら ""
  totalQuestions: number;
  correctCount: number; // 〇
  partialCount: number; // △
  incorrectCount: number; // ✕
  earnedPoints: number;
  maxPoints: number;
  accuracyPct: number;
  token: string;
}

export function getGasConfig(): GasConfig {
  if (typeof window === 'undefined') {
    return { url: '', token: '', isConfigured: false };
  }
  try {
    const url = (localStorage.getItem(GAS_URL_STORAGE_KEY) || '').trim();
    const token = (localStorage.getItem(GAS_TOKEN_STORAGE_KEY) || '').trim();
    return {
      url,
      token,
      isConfigured: Boolean(url && token),
    };
  } catch (e) {
    console.warn('Failed to read GAS config from localStorage', e);
    return { url: '', token: '', isConfigured: false };
  }
}

export function saveGasConfig(url: string, token: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(GAS_URL_STORAGE_KEY, url.trim());
    localStorage.setItem(GAS_TOKEN_STORAGE_KEY, token.trim());
  } catch (e) {
    console.error('Failed to save GAS config', e);
  }
}

export function getPendingQueue(): GasDrillPayload[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(GAS_QUEUE_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function savePendingQueue(queue: GasDrillPayload[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(GAS_QUEUE_STORAGE_KEY, JSON.stringify(queue.slice(-20))); // 最大20件保持
  } catch (e) {
    console.warn('Failed to save pending queue', e);
  }
}

/**
 * 日本時間（JST）の "YYYY/MM/DD HH:mm" 文字列を生成
 */
export function getJSTTimestamp(): string {
  const now = new Date();
  const jst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const year = jst.getUTCFullYear();
  const month = String(jst.getUTCMonth() + 1).padStart(2, '0');
  const day = String(jst.getUTCDate()).padStart(2, '0');
  const hours = String(jst.getUTCHours()).padStart(2, '0');
  const minutes = String(jst.getUTCMinutes()).padStart(2, '0');
  return `${year}/${month}/${day} ${hours}:${minutes}`;
}

/**
 * GASへ演習データを送信 (POST / Content-Type: text/plain でCORSプリフライトを回避)
 */
export async function sendDrillResultToGas(
  payload: GasDrillPayload
): Promise<{ success: boolean; error?: string; queued?: boolean }> {
  const config = getGasConfig();
  if (!config.isConfigured) {
    // 未設定の場合は完全サイレント（送信せず成功扱いとして通過）
    return { success: true };
  }

  // ペイロードの合言葉を最新の設定に合わせる
  const fullPayload: GasDrillPayload = {
    ...payload,
    token: config.token,
  };

  try {
    // まず今回のデータを送信
    const res = await fetch(config.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: JSON.stringify(fullPayload),
    });

    if (!res.ok) {
      throw new Error(`HTTP Error: ${res.status}`);
    }

    // GASからのJSONレスポンスを検証（合言葉不一致等で status: "error" が返ってきた場合）
    try {
      const data = await res.json();
      if (data && data.status === 'error') {
        throw new Error(data.message === 'auth' ? '合言葉認証エラー' : (data.message || 'GASエラー'));
      }
    } catch (parseErr: any) {
      // JSONエラーで明示的にthrowされたエラーは外側へ伝播
      if (parseErr.message.includes('認証') || parseErr.message.includes('GASエラー')) {
        throw parseErr;
      }
      // 通常のプレーンテキスト等の場合は200 OKとして通過
    }

    // 成功したらキュー内の未送信データもバックグラウンドで消化
    flushPendingQueue(config.url, config.token).catch(() => {});

    return { success: true };
  } catch (err: any) {
    console.warn('GAS sync failed, saving to offline queue:', err);
    // 失敗時はローカルキューへ退避
    const currentQueue = getPendingQueue();
    currentQueue.push(fullPayload);
    savePendingQueue(currentQueue);
    return { success: false, error: err?.message || '通信エラー', queued: true };
  }
}

/**
 * 未送信キューのデータを順次送信
 */
async function flushPendingQueue(url: string, token: string): Promise<void> {
  const queue = getPendingQueue();
  if (queue.length === 0) return;

  const remaining: GasDrillPayload[] = [];
  for (const item of queue) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ ...item, token }),
      });
      if (!res.ok) {
        remaining.push(item);
      }
    } catch {
      remaining.push(item);
    }
  }
  savePendingQueue(remaining);
}

/**
 * 接続テスト用の送信
 */
export async function testGasConnection(
  url: string,
  token: string
): Promise<{ success: boolean; message: string }> {
  const trimmedUrl = url.trim();
  const trimmedToken = token.trim();

  if (!trimmedUrl) {
    return { success: false, message: 'URLが入力されていません。' };
  }
  if (!trimmedToken) {
    return { success: false, message: '合言葉が入力されていません。' };
  }

  const testPayload: GasDrillPayload = {
    timestamp: getJSTTimestamp(),
    subjectName: '接続テスト',
    grade: 1,
    difficulty: 'テスト',
    unitName: 'GAS連携動作確認',
    item: 'テスト送信',
    totalQuestions: 1,
    correctCount: 1,
    partialCount: 0,
    incorrectCount: 0,
    earnedPoints: 5,
    maxPoints: 5,
    accuracyPct: 100,
    token: trimmedToken,
  };

  try {
    const res = await fetch(trimmedUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify(testPayload),
    });

    if (!res.ok) {
      return {
        success: false,
        message: `HTTPエラー (${res.status}): GASのデプロイ設定（アクセス権: 全員）を確認してください。`,
      };
    }

    // JSONレスポンスのチェックを試みる
    try {
      const data = await res.json();
      if (data.status === 'error') {
        const errMsg =
          data.message === 'auth'
            ? '認証失敗: 合言葉（Token）が正しくありません。登録済みの合言葉を確認してください。'
            : `GASエラー: ${data.message || 'データ処理に失敗しました。'}`;
        return {
          success: false,
          message: errMsg,
        };
      }
    } catch {
      // JSONパースできなくても200 OKなら通信成功とみなす
    }

    return {
      success: true,
      message: '接続テスト成功！スプレッドシートに「接続テスト」行が追加されたことを確認してください。',
    };
  } catch (err: any) {
    return {
      success: false,
      message: `通信失敗: ${err.message || 'URLまたはネットワークを確認してください。'}`,
    };
  }
}
