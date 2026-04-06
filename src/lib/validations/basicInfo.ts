import { z } from 'zod';

export const basicInfoSchema = z.object({
  birthDate: z
    .string()
    .min(1, '生年月日を入力してください')
    .regex(/^\d{4}-\d{2}-\d{2}$/, '正しい日付を入力してください')
    .refine((val) => {
      const date = new Date(val);
      const now = new Date();
      const minDate = new Date('1920-01-01');
      return date >= minDate && date <= now;
    }, '有効な生年月日を入力してください'),

  gender: z
    .enum(['male', 'female', 'other'])
    .nullable()
    .optional(),

  currentStatus: z.enum(
    ['job-hunting', 'considering-change', 'self-discovery', 'other'],
    { error: '現在の状況を選択してください' }
  ),

  qualifications: z.array(z.string()),

  currentOccupation: z.string().max(100),

  fieldOfStudy: z.string().max(100),

  industryExperience: z
    .object({
      years: z.number().min(0).max(50),
      field: z.string().max(100),
    })
    .nullable()
    .optional(),

  constraints: z.string().max(800).optional().default(''),
});

export type BasicInfoFormValues = z.infer<typeof basicInfoSchema>;
