'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { basicInfoSchema, type BasicInfoFormValues } from '@/lib/validations/basicInfo';
import { useDiagnosis } from '@/store/diagnosisStore';
import { Button } from '@/components/ui/Button';
import { QualificationSelect } from './QualificationSelect';
import type { BasicInfo } from '@/types/diagnosis';

// 現在の状況の選択肢
const STATUS_OPTIONS: { value: BasicInfo['currentStatus']; label: string; icon: string }[] = [
  { value: 'job-hunting', label: '就職活動中', icon: '🎓' },
  { value: 'considering-change', label: '転職を考えている', icon: '🔄' },
  { value: 'self-discovery', label: '自己分析・キャリア探索', icon: '✨' },
  { value: 'other', label: 'その他・興味本位', icon: '🌟' },
];

// 性別の選択肢
const GENDER_OPTIONS: { value: BasicInfo['gender']; label: string }[] = [
  { value: 'male', label: '男性' },
  { value: 'female', label: '女性' },
  { value: 'other', label: '回答しない' },
];

// 業界経験年数の選択肢
const YEARS_OPTIONS = [1, 2, 3, 5, 7, 10, 15, 20, 25, 30];

interface FieldWrapperProps {
  label: string;
  required?: boolean;
  optional?: boolean;
  error?: string;
  children: React.ReactNode;
  delay: number;
}

function FieldWrapper({ label, required, optional, error, children, delay }: FieldWrapperProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' as const }}
      className="space-y-2"
    >
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-divine-200">{label}</label>
        {required && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-gold-500/20 border border-gold-500/40 text-gold-300">
            必須
          </span>
        )}
        {optional && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-oracle-700/50 border border-oracle-600/40 text-divine-300/60">
            任意
          </span>
        )}
      </div>
      {children}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-red-400"
          role="alert"
        >
          {error}
        </motion.p>
      )}
    </motion.div>
  );
}

export function BasicInfoForm() {
  const router = useRouter();
  const { dispatch } = useDiagnosis();
  const [hasExperience, setHasExperience] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = useForm<BasicInfoFormValues>({
    resolver: zodResolver(basicInfoSchema) as any,
    defaultValues: {
      birthDate: '',
      gender: null,
      currentStatus: undefined,
      qualifications: [],
      currentOccupation: '',
      fieldOfStudy: '',
      industryExperience: null,
    },
  });

  const selectedGender = watch('gender');
  const selectedStatus = watch('currentStatus');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = (data: any) => {
    const typed = data as BasicInfoFormValues;
    const basicInfo: BasicInfo = {
      birthDate: typed.birthDate,
      gender: typed.gender ?? null,
      currentStatus: typed.currentStatus,
      qualifications: typed.qualifications ?? [],
      currentOccupation: typed.currentOccupation ?? '',
      fieldOfStudy: typed.fieldOfStudy ?? '',
      industryExperience: hasExperience ? (typed.industryExperience ?? null) : null,
    };
    dispatch({ type: 'SET_BASIC_INFO', payload: basicInfo });
    router.push('/diagnosis/questions');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-8">
      {/* 生年月日 */}
      <FieldWrapper
        label="生年月日"
        required
        error={errors.birthDate?.message}
        delay={0}
      >
        <input
          type="date"
          {...register('birthDate')}
          max={new Date().toISOString().split('T')[0]}
          min="1920-01-01"
          className="w-full px-4 py-3 rounded-xl bg-oracle-800/60 border border-oracle-600/50 text-divine-100 focus:outline-none focus:border-gold-500/70 focus:ring-1 focus:ring-gold-500/30 transition-colors"
          aria-invalid={!!errors.birthDate}
        />
      </FieldWrapper>

      {/* 性別 */}
      <FieldWrapper
        label="性別"
        optional
        delay={0.06}
      >
        <div className="flex gap-3">
          {GENDER_OPTIONS.map((opt) => {
            const isSelected = selectedGender === opt.value;
            return (
              <button
                key={String(opt.value)}
                type="button"
                onClick={() => setValue('gender', isSelected ? null : opt.value)}
                className={`flex-1 py-3 px-2 rounded-xl text-sm font-medium border transition-all ${
                  isSelected
                    ? 'bg-gold-500/25 border-gold-400/70 text-gold-200 shadow-[0_0_12px_rgba(212,168,83,0.2)]'
                    : 'bg-oracle-800/50 border-oracle-600/40 text-divine-300 hover:border-oracle-400/60'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </FieldWrapper>

      {/* 現在の状況 */}
      <FieldWrapper
        label="現在の状況"
        required
        error={errors.currentStatus?.message}
        delay={0.12}
      >
        <div className="grid grid-cols-2 gap-3">
          {STATUS_OPTIONS.map((opt) => {
            const isSelected = selectedStatus === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setValue('currentStatus', opt.value, { shouldValidate: true })}
                className={`flex items-center gap-3 px-4 py-4 rounded-xl text-sm text-left border transition-all ${
                  isSelected
                    ? 'bg-gold-500/20 border-gold-400/70 text-gold-200 shadow-[0_0_16px_rgba(212,168,83,0.2)]'
                    : 'bg-oracle-800/50 border-oracle-600/40 text-divine-300 hover:border-oracle-400/60'
                }`}
              >
                <span className="text-xl">{opt.icon}</span>
                <span className="font-medium leading-tight">{opt.label}</span>
              </button>
            );
          })}
        </div>
      </FieldWrapper>

      {/* 保有資格 */}
      <FieldWrapper
        label="保有資格"
        optional
        delay={0.18}
      >
        <Controller
          name="qualifications"
          control={control}
          render={({ field }) => (
            <QualificationSelect
              value={field.value ?? []}
              onChange={field.onChange}
            />
          )}
        />
      </FieldWrapper>

      {/* 現在の職業または専攻分野 */}
      <FieldWrapper
        label="現在の職業または専攻分野"
        optional
        delay={0.24}
      >
        <input
          type="text"
          {...register('currentOccupation')}
          placeholder="例: Webエンジニア、経営学部3年生、看護師..."
          className="w-full px-4 py-3 rounded-xl bg-oracle-800/60 border border-oracle-600/50 text-divine-100 placeholder:text-divine-300/40 focus:outline-none focus:border-gold-500/70 focus:ring-1 focus:ring-gold-500/30 transition-colors"
        />
      </FieldWrapper>

      {/* 学部・専攻 */}
      <FieldWrapper
        label="学部・専攻（学生の方）"
        optional
        delay={0.30}
      >
        <input
          type="text"
          {...register('fieldOfStudy')}
          placeholder="例: 工学部情報工学科、経済学部..."
          className="w-full px-4 py-3 rounded-xl bg-oracle-800/60 border border-oracle-600/50 text-divine-100 placeholder:text-divine-300/40 focus:outline-none focus:border-gold-500/70 focus:ring-1 focus:ring-gold-500/30 transition-colors"
        />
      </FieldWrapper>

      {/* 業界経験 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.36, ease: 'easeOut' as const }}
        className="space-y-3"
      >
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-divine-200">業界経験</label>
          <span className="text-xs px-2 py-0.5 rounded-full bg-oracle-700/50 border border-oracle-600/40 text-divine-300/60">
            任意
          </span>
          <button
            type="button"
            onClick={() => {
              setHasExperience(!hasExperience);
              if (!hasExperience) {
                setValue('industryExperience', { years: 1, field: '' });
              } else {
                setValue('industryExperience', null);
              }
            }}
            className={`ml-auto px-4 py-1.5 rounded-full text-xs border transition-all ${
              hasExperience
                ? 'bg-gold-500/20 border-gold-400/60 text-gold-300'
                : 'bg-oracle-800/50 border-oracle-600/40 text-divine-300/60 hover:border-oracle-400/60'
            }`}
          >
            {hasExperience ? '入力する ✓' : '+ 経験を追加'}
          </button>
        </div>

        {hasExperience && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="grid grid-cols-3 gap-3"
          >
            <div className="col-span-1">
              <select
                {...register('industryExperience.years', { valueAsNumber: true })}
                className="w-full px-3 py-3 rounded-xl bg-oracle-800/60 border border-oracle-600/50 text-divine-100 focus:outline-none focus:border-gold-500/70 transition-colors"
              >
                {YEARS_OPTIONS.map((y) => (
                  <option key={y} value={y}>
                    {y}年
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-2">
              <input
                type="text"
                {...register('industryExperience.field')}
                placeholder="例: IT・Webサービス、医療・製薬..."
                className="w-full px-4 py-3 rounded-xl bg-oracle-800/60 border border-oracle-600/50 text-divine-100 placeholder:text-divine-300/40 focus:outline-none focus:border-gold-500/70 transition-colors"
              />
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* 送信ボタン */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.42, ease: 'easeOut' as const }}
        className="pt-4"
      >
        <Button
          type="submit"
          size="lg"
          fullWidth
          disabled={isSubmitting}
        >
          {isSubmitting ? '処理中...' : '次へ — 質問へ進む'}
        </Button>
      </motion.div>
    </form>
  );
}
