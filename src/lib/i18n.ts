/**
 * i18n ユーティリティ
 *
 * src/locales/ja.json をベースにしたシンプルなテキスト取得関数。
 * ドット区切りのキーでネストされたテキストにアクセスできる。
 *
 * 使い方:
 *   import { t } from '@/lib/i18n';
 *   t('common.appName')        // => "天職神託"
 *   t('chat.title')            // => "AIカウンセラーに相談する"
 *   t('diagnosis.progressLabel', { current: '2', total: '4' }) // => "ステップ 2 / 4"
 */

import ja from '@/locales/ja.json';

type LocaleData = typeof ja;

/**
 * ドット区切りキーで ja.json の値を取得する。
 * キーが存在しない場合はキー文字列をそのまま返す（フォールバック）。
 *
 * @param key - ドット区切りのキー（例: "common.appName"）
 * @param params - {{key}} 形式のプレースホルダーを置換するパラメータ
 */
export function t(key: string, params?: Record<string, string | number>): string {
  const keys = key.split('.');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let value: any = ja as LocaleData;

  for (const k of keys) {
    if (value === null || value === undefined || typeof value !== 'object') {
      // キーが見つからない場合はキー文字列をフォールバックとして返す
      return key;
    }
    value = value[k as keyof typeof value];
  }

  if (typeof value !== 'string') {
    return key;
  }

  if (!params) {
    return value;
  }

  // {{key}} 形式のプレースホルダーを置換
  return value.replace(/\{\{(\w+)\}\}/g, (_, placeholder: string) => {
    const replacement = params[placeholder];
    return replacement !== undefined ? String(replacement) : `{{${placeholder}}}`;
  });
}

/**
 * 特定のセクションのテキストをまとめて取得するヘルパー。
 * セクション名を固定したい場合に便利。
 *
 * 使い方:
 *   const tc = createSectionT('chat');
 *   tc('title')  // => "AIカウンセラーに相談する"
 */
export function createSectionT(section: keyof LocaleData) {
  return (key: string, params?: Record<string, string | number>): string => {
    return t(`${section}.${key}`, params);
  };
}
