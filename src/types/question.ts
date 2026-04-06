// 質問・回答の型定義

export type QuestionCategory = 'bigfive' | 'riasec' | 'values' | 'preferences';

export interface Question {
  id: string;
  category: QuestionCategory;
  text: string;
  options: QuestionOption[];
  scoringKey: ScoringKey;
}

export interface QuestionOption {
  label: string;
  value: number;
}

export interface ScoringKey {
  target: string;        // e.g., 'openness', 'realistic'
  multiplier: number;    // 正負の重み
}

export interface FreeTextQuestion {
  id: string;
  text: string;
  placeholder: string;
  maxLength: number;
}
