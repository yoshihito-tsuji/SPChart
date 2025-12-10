/**
 * ロギングユーティリティ
 *
 * 開発時はconsoleに出力、本番時は抑制
 * 将来的に外部サービス連携も可能
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: Date;
  context?: Record<string, unknown>;
  error?: Error;
}

// ログ履歴（デバッグ用に保持）
const logHistory: LogEntry[] = [];
const MAX_LOG_HISTORY = 100;

/**
 * 本番環境かどうかを判定
 */
function isProduction(): boolean {
  return import.meta.env.PROD;
}

/**
 * ログエントリを作成
 */
function createLogEntry(
  level: LogLevel,
  message: string,
  context?: Record<string, unknown>,
  error?: Error
): LogEntry {
  return {
    level,
    message,
    timestamp: new Date(),
    context,
    error,
  };
}

/**
 * ログを履歴に追加
 */
function addToHistory(entry: LogEntry): void {
  logHistory.push(entry);
  if (logHistory.length > MAX_LOG_HISTORY) {
    logHistory.shift();
  }
}

/**
 * ログを出力
 */
function outputLog(entry: LogEntry): void {
  // 本番環境ではerror以外を抑制
  if (isProduction() && entry.level !== 'error') {
    return;
  }

  const timestamp = entry.timestamp.toISOString();
  const prefix = `[${timestamp}] [${entry.level.toUpperCase()}]`;

  switch (entry.level) {
    case 'debug':
      console.debug(prefix, entry.message, entry.context ?? '');
      break;
    case 'info':
      console.info(prefix, entry.message, entry.context ?? '');
      break;
    case 'warn':
      console.warn(prefix, entry.message, entry.context ?? '');
      break;
    case 'error':
      console.error(prefix, entry.message, entry.context ?? '', entry.error ?? '');
      break;
  }
}

/**
 * ロガーオブジェクト
 */
export const logger = {
  /**
   * デバッグログ
   */
  debug(message: string, context?: Record<string, unknown>): void {
    const entry = createLogEntry('debug', message, context);
    addToHistory(entry);
    outputLog(entry);
  },

  /**
   * 情報ログ
   */
  info(message: string, context?: Record<string, unknown>): void {
    const entry = createLogEntry('info', message, context);
    addToHistory(entry);
    outputLog(entry);
  },

  /**
   * 警告ログ
   */
  warn(message: string, context?: Record<string, unknown>): void {
    const entry = createLogEntry('warn', message, context);
    addToHistory(entry);
    outputLog(entry);
  },

  /**
   * エラーログ
   */
  error(message: string, error?: Error, context?: Record<string, unknown>): void {
    const entry = createLogEntry('error', message, context, error);
    addToHistory(entry);
    outputLog(entry);
  },

  /**
   * ログ履歴を取得（デバッグ用）
   */
  getHistory(): readonly LogEntry[] {
    return [...logHistory];
  },

  /**
   * ログ履歴をクリア
   */
  clearHistory(): void {
    logHistory.length = 0;
  },
};

/**
 * エラーを安全にErrorオブジェクトに変換
 */
export function toError(value: unknown): Error {
  if (value instanceof Error) {
    return value;
  }
  if (typeof value === 'string') {
    return new Error(value);
  }
  return new Error(String(value));
}
