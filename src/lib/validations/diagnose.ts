import { z } from 'zod';

const BasicInfoSchema = z.object({
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, '生年月日はYYYY-MM-DD形式で入力してください'),
  gender: z.enum(['male', 'female', 'other']).nullable(),
  currentStatus: z.enum(['job-hunting', 'considering-change', 'self-discovery', 'other']),
  qualifications: z.array(z.string()),
  currentOccupation: z.string(),
  fieldOfStudy: z.string(),
  industryExperience: z.array(
    z.object({
      years: z.number().int().min(0).max(60),
      field: z.string(),
    })
  ).optional().default([]),
  constraints: z.string().max(800).optional().default(''),
});

const QuestionAnswerSchema = z.object({
  questionId: z.string(),
  selectedOptionIndex: z.number().int().min(0),
  value: z.number().int().min(1).max(5),
});

const FreeTextAnswerSchema = z.object({
  questionId: z.string(),
  text: z.string(),
});

export const DiagnoseRequestSchema = z.object({
  basicInfo: BasicInfoSchema,
  answers: z.array(QuestionAnswerSchema).min(1, '回答が必要です'),
  freeTexts: z.array(FreeTextAnswerSchema),
});

export type DiagnoseRequest = z.infer<typeof DiagnoseRequestSchema>;
