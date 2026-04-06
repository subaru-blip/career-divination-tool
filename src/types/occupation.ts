// 職業データの型定義

import type { BigFiveScores, RIASECScores } from './diagnosis';

export interface Occupation {
  id: string;
  name: string;
  nameEn: string;
  category: OccupationCategory;
  description: string;
  bigFiveProfile: BigFiveScores;
  riasecCode: RIASECScores;
  requiredQualifications: string[];   // この職業に必須の資格
  relatedQualifications: string[];    // 関連する資格
  averageSalary: string;              // 年収目安
  growthOutlook: 'high' | 'medium' | 'low';
}

export type OccupationCategory =
  | 'medical'       // 医療・福祉
  | 'it'            // IT・テクノロジー
  | 'education'     // 教育
  | 'creative'      // クリエイティブ
  | 'business'      // ビジネス・経営
  | 'finance'       // 金融
  | 'legal'         // 法律
  | 'science'       // 科学・研究
  | 'engineering'   // エンジニアリング
  | 'social'        // 社会・公共
  | 'arts'          // 芸術・文化
  | 'service'       // サービス
  | 'manufacturing' // 製造
  | 'agriculture'   // 農林水産
  | 'media'         // メディア・広告
  | 'sports'        // スポーツ
  | 'other';        // その他

export interface QualificationMapping {
  qualification: string;
  occupationIds: string[];
}
