// 診断フロー全体の型定義

export interface BasicInfo {
  birthDate: string; // YYYY-MM-DD
  gender: 'male' | 'female' | 'other' | null;
  currentStatus: 'job-hunting' | 'considering-change' | 'self-discovery' | 'other';
  qualifications: string[];
  currentOccupation: string;
  fieldOfStudy: string;
  industryExperience: {
    years: number;
    field: string;
  } | null;
  constraints: string; // 今の状況・制約（自由入力）
}

export interface DiagnosisSession {
  sessionId: string;
  basicInfo: BasicInfo;
  answers: QuestionAnswer[];
  freeTexts: FreeTextAnswer[];
  scores: DiagnosisScores | null;
  result: DiagnosisResult | null;
  createdAt: string;
}

export interface QuestionAnswer {
  questionId: string;
  selectedOptionIndex: number;
  value: number;
}

export interface FreeTextAnswer {
  questionId: string;
  text: string;
}

export interface DiagnosisScores {
  bigFive: BigFiveScores;
  riasec: RIASECScores;
  values: ValuesScores;
  fortune: FortuneScores;
}

export interface BigFiveScores {
  openness: number;       // 開放性 (0-100)
  conscientiousness: number; // 誠実性
  extraversion: number;   // 外向性
  agreeableness: number;  // 協調性
  neuroticism: number;    // 神経症傾向
}

export interface RIASECScores {
  realistic: number;      // 現実型 (0-100)
  investigative: number;  // 研究型
  artistic: number;       // 芸術型
  social: number;         // 社会型
  enterprising: number;   // 企業型
  conventional: number;   // 慣習型
}

export interface ValuesScores {
  stabilityVsChallenge: number;  // -100(安定) ~ +100(挑戦)
  individualVsTeam: number;      // -100(個人) ~ +100(チーム)
  incomeVsMeaning: number;       // -100(収入) ~ +100(意味)
  localVsGlobal: number;         // -100(地元) ~ +100(グローバル)
}

export interface FortuneScores {
  destinyNumber: number;   // 運命数 (1-9)
  zodiacSign: string;      // 星座
  chineseZodiac: string;   // 干支
  element: string;         // 属性(火/水/風/土)
}

export interface DiagnosisResult {
  archetype: Archetype;
  divineMessage: string;
  realPath: CareerPath | null;  // 資格入力時のみ
  idealPath: CareerPath;
}

export interface CareerPath {
  mainOccupation: OccupationMatch;
  subOccupations: OccupationMatch[];
  careerTimeline: {
    threeYears: string;
    fiveYears: string;
    tenYears: string;
  };
}

export interface OccupationMatch {
  occupationId: string;
  name: string;
  category: string;
  matchScore: number; // 0-100
  reason: string;
}

export interface Archetype {
  id: string;
  name: string;
  description: string;
  colorPalette: {
    primary: string;
    secondary: string;
    accent: string;
  };
  bigFiveProfile: BigFiveScores;
}
