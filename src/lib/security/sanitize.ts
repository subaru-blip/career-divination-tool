/**
 * 入力サニタイズユーティリティ
 * XSS・SQLインジェクション対策、文字数制限チェックを提供する。
 */

import type { BasicInfoFormValues } from '@/lib/validations/basicInfo';

/** デフォルトの最大文字数 */
const DEFAULT_MAX_LENGTH = 1000;

/**
 * テキスト入力のサニタイズ
 * - HTMLタグを除去（XSS対策）
 * - 制御文字を除去
 * - SQLインジェクション的なパターンを無害化（--コメント、複数クォート等）
 * - 前後の空白をトリム
 * - maxLength を超えた場合は切り捨て
 */
export function sanitizeText(input: string, maxLength: number = DEFAULT_MAX_LENGTH): string {
  if (typeof input !== 'string') {
    return '';
  }

  let sanitized = input;

  // HTMLタグ除去（<script>、<img>等すべてのタグ）
  sanitized = sanitized.replace(/<[^>]*>/g, '');

  // HTMLエンティティのデコード後に再エスケープ（二重エンコード攻撃対策）
  sanitized = sanitized
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#x27;/gi, "'")
    .replace(/&#x2F;/gi, '/')
    .replace(/<[^>]*>/g, ''); // デコード後に再度タグ除去

  // javascript: プロトコルの除去（href等への埋め込み対策）
  sanitized = sanitized.replace(/javascript\s*:/gi, '');
  sanitized = sanitized.replace(/vbscript\s*:/gi, '');
  sanitized = sanitized.replace(/data\s*:/gi, '');

  // onXXX イベントハンドラーパターンの除去
  sanitized = sanitized.replace(/on\w+\s*=/gi, '');

  // SQLインジェクション的なパターンの無害化
  // 行末コメント（-- ）を無害化
  sanitized = sanitized.replace(/--+/g, '-');
  // セミコロンによる複文分割を無害化（URLに必要な場合もあるので置換ではなく削除のみ）
  // ただしユーザーの自由記述では文末に使う可能性があるためそのまま残す
  // UNION, DROP, INSERT, DELETE, UPDATE 等のSQLキーワードはORMレイヤーで対処するため除去しない

  // NULL バイト除去
  sanitized = sanitized.replace(/\0/g, '');

  // 制御文字（改行・タブ以外）の除去
  // eslint-disable-next-line no-control-regex
  sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

  // 前後の空白をトリム
  sanitized = sanitized.trim();

  // 文字数制限
  if (sanitized.length > maxLength) {
    sanitized = sanitized.slice(0, maxLength);
  }

  return sanitized;
}

/**
 * BasicInfo オブジェクト全体のサニタイズ
 * - 文字列フィールドに sanitizeText を適用
 * - 配列（qualifications）の各要素もサニタイズ
 * - 数値・enum フィールドはバリデーション済みのためそのまま通す
 */
export function sanitizeBasicInfo(info: BasicInfoFormValues): BasicInfoFormValues {
  return {
    ...info,
    currentOccupation: sanitizeText(info.currentOccupation, 100),
    fieldOfStudy: sanitizeText(info.fieldOfStudy, 100),
    qualifications: info.qualifications.map((q) => sanitizeText(q, 100)),
    industryExperience: (info.industryExperience ?? []).map((exp) => ({
      ...exp,
      field: sanitizeText(exp.field, 100),
    })),
    constraints: sanitizeText(info.constraints ?? '', 800),
  };
}
