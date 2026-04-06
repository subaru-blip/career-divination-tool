// 占い要素の算出
// - 運命数（数秘術: 生年月日の各桁を足し、1桁になるまで繰り返す）
// - 星座（12星座）
// - 干支（12支）
// - 属性（火/水/風/土、運命数から決定）

import type { FortuneScores } from '../../types/diagnosis';

// ──────────────────────────────────────────────
// 運命数（数秘術）
// ──────────────────────────────────────────────

function calculateDestinyNumber(birthDate: string): number {
  // birthDate: YYYY-MM-DD
  const digits = birthDate.replace(/-/g, '').split('').map(Number);
  let sum = digits.reduce((acc, d) => acc + d, 0);
  // 1桁になるまで繰り返し足す（マスターナンバー 11/22 は通常数秘では保持するが、ここでは1桁に統一）
  while (sum >= 10) {
    sum = sum
      .toString()
      .split('')
      .map(Number)
      .reduce((acc, d) => acc + d, 0);
  }
  return sum === 0 ? 9 : sum; // 0 にならない保護（生年月日の合計が0になるケースは実際には発生しない）
}

// ──────────────────────────────────────────────
// 星座（12星座）
// ──────────────────────────────────────────────

interface ZodiacRange {
  name: string;
  startMonth: number;
  startDay: number;
  endMonth: number;
  endDay: number;
}

const ZODIAC_SIGNS: ZodiacRange[] = [
  { name: '牡羊座', startMonth: 3, startDay: 21, endMonth: 4, endDay: 19 },
  { name: '牡牛座', startMonth: 4, startDay: 20, endMonth: 5, endDay: 20 },
  { name: '双子座', startMonth: 5, startDay: 21, endMonth: 6, endDay: 21 },
  { name: '蟹座', startMonth: 6, startDay: 22, endMonth: 7, endDay: 22 },
  { name: '獅子座', startMonth: 7, startDay: 23, endMonth: 8, endDay: 22 },
  { name: '乙女座', startMonth: 8, startDay: 23, endMonth: 9, endDay: 22 },
  { name: '天秤座', startMonth: 9, startDay: 23, endMonth: 10, endDay: 23 },
  { name: '蠍座', startMonth: 10, startDay: 24, endMonth: 11, endDay: 22 },
  { name: '射手座', startMonth: 11, startDay: 23, endMonth: 12, endDay: 21 },
  { name: '山羊座', startMonth: 12, startDay: 22, endMonth: 12, endDay: 31 },
  { name: '山羊座', startMonth: 1, startDay: 1, endMonth: 1, endDay: 19 },
  { name: '水瓶座', startMonth: 1, startDay: 20, endMonth: 2, endDay: 18 },
  { name: '魚座', startMonth: 2, startDay: 19, endMonth: 3, endDay: 20 },
];

function getZodiacSign(birthDate: string): string {
  const [, monthStr, dayStr] = birthDate.split('-');
  const month = parseInt(monthStr, 10);
  const day = parseInt(dayStr, 10);

  for (const sign of ZODIAC_SIGNS) {
    const afterStart =
      month > sign.startMonth ||
      (month === sign.startMonth && day >= sign.startDay);
    const beforeEnd =
      month < sign.endMonth ||
      (month === sign.endMonth && day <= sign.endDay);
    if (afterStart && beforeEnd) {
      return sign.name;
    }
  }
  return '魚座'; // フォールバック（3/20付近）
}

// ──────────────────────────────────────────────
// 干支（12支）
// ──────────────────────────────────────────────

const CHINESE_ZODIAC = [
  '申', '酉', '戌', '亥', '子', '丑', '寅', '卯', '辰', '巳', '午', '未',
] as const;

// 1900年は庚子（子=ねずみ）。インデックス基準: 1900年 → index 4（子）
// 簡易計算: (year - 1900) % 12 でオフセットして12支配列にマップ
const BASE_YEAR = 1900;
const BASE_INDEX = 4; // 1900年 = 子（ねずみ）

function getChineseZodiac(birthDate: string): string {
  const year = parseInt(birthDate.split('-')[0], 10);
  const index = ((year - BASE_YEAR) + BASE_INDEX) % 12;
  return CHINESE_ZODIAC[(index + 12) % 12];
}

// ──────────────────────────────────────────────
// 属性（火/水/風/土）
// 運命数から決定: 1,5,7=火 / 2,4,8=土 / 3,6,9=風 / それ以外=水（実際は1-9のみ）
// ──────────────────────────────────────────────

const ELEMENT_MAP: Record<number, string> = {
  1: '火', 5: '火', 7: '火',
  2: '土', 4: '土', 8: '土',
  3: '風', 6: '風', 9: '風',
};

function getElement(destinyNumber: number): string {
  return ELEMENT_MAP[destinyNumber] ?? '水';
}

// ──────────────────────────────────────────────
// メイン関数
// ──────────────────────────────────────────────

export function calculateFortune(birthDate: string): FortuneScores {
  const destinyNumber = calculateDestinyNumber(birthDate);
  return {
    destinyNumber,
    zodiacSign: getZodiacSign(birthDate),
    chineseZodiac: getChineseZodiac(birthDate),
    element: getElement(destinyNumber),
  };
}
