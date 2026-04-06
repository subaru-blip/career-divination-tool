'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { basicInfoSchema, type BasicInfoFormValues } from '@/lib/validations/basicInfo';
import { useDiagnosis } from '@/store/diagnosisStore';
import { Button } from '@/components/ui/Button';
import { QualificationSelect } from './QualificationSelect';
import type { BasicInfo } from '@/types/diagnosis';

// 年のリスト（現在年〜1940年）
const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: currentYear - 1940 + 1 }, (_, i) => currentYear - i);
const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

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
  // 生年月日の年・月・日を個別stateで管理
  const [birthYear, setBirthYear] = useState<number | ''>('');
  const [birthMonth, setBirthMonth] = useState<number | ''>('');
  const [birthDay, setBirthDay] = useState<number | ''>('');

  const daysInMonth = useMemo(() => {
    if (birthYear === '' || birthMonth === '') return 31;
    return getDaysInMonth(birthYear, birthMonth);
  }, [birthYear, birthMonth]);

  const DAYS = useMemo(() =>
    Array.from({ length: daysInMonth }, (_, i) => i + 1),
    [daysInMonth]
  );

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
      industryExperience: [],
    },
  });

  const selectedGender = watch('gender');
  const selectedStatus = watch('currentStatus');

  // 年・月・日が揃ったら birthDate を更新
  function updateBirthDate(y: number | '', m: number | '', d: number | '') {
    if (y !== '' && m !== '' && d !== '') {
      const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      setValue('birthDate', dateStr, { shouldValidate: true });
    } else {
      setValue('birthDate', '', { shouldValidate: false });
    }
  }

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
      industryExperience: typed.industryExperience ?? [],
      constraints: typed.constraints ?? '',
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
        {/* hidden field for react-hook-form */}
        <input type="hidden" {...register('birthDate')} />
        <div className="grid grid-cols-3 gap-3">
          <select
            value={birthYear}
            onChange={(e) => {
              const y = e.target.value ? Number(e.target.value) : '' as const;
              setBirthYear(y);
              // 日が月の最大日数を超える場合はリセット
              if (y !== '' && birthMonth !== '' && birthDay !== '') {
                const maxDay = getDaysInMonth(y as number, birthMonth as number);
                if ((birthDay as number) > maxDay) setBirthDay('');
              }
              updateBirthDate(y, birthMonth, birthDay);
            }}
            className="w-full px-3 py-3 rounded-xl bg-oracle-800/60 border border-oracle-600/50 text-divine-100 focus:outline-none focus:border-gold-500/70 focus:ring-1 focus:ring-gold-500/30 transition-colors"
            aria-label="生年"
          >
            <option value="">年</option>
            {YEARS.map((y) => (
              <option key={y} value={y}>{y}年</option>
            ))}
          </select>
          <select
            value={birthMonth}
            onChange={(e) => {
              const m = e.target.value ? Number(e.target.value) : '' as const;
              setBirthMonth(m);
              if (birthYear !== '' && m !== '' && birthDay !== '') {
                const maxDay = getDaysInMonth(birthYear as number, m as number);
                if ((birthDay as number) > maxDay) setBirthDay('');
              }
              updateBirthDate(birthYear, m, birthDay);
            }}
            className="w-full px-3 py-3 rounded-xl bg-oracle-800/60 border border-oracle-600/50 text-divine-100 focus:outline-none focus:border-gold-500/70 focus:ring-1 focus:ring-gold-500/30 transition-colors"
            aria-label="生月"
          >
            <option value="">月</option>
            {MONTHS.map((m) => (
              <option key={m} value={m}>{m}月</option>
            ))}
          </select>
          <select
            value={birthDay}
            onChange={(e) => {
              const d = e.target.value ? Number(e.target.value) : '' as const;
              setBirthDay(d);
              updateBirthDate(birthYear, birthMonth, d);
            }}
            className="w-full px-3 py-3 rounded-xl bg-oracle-800/60 border border-oracle-600/50 text-divine-100 focus:outline-none focus:border-gold-500/70 focus:ring-1 focus:ring-gold-500/30 transition-colors"
            aria-label="生日"
          >
            <option value="">日</option>
            {DAYS.map((d) => (
              <option key={d} value={d}>{d}日</option>
            ))}
          </select>
        </div>
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

      {/* 今の状況・制約 */}
      <FieldWrapper
        label="今の状況を教えてください"
        optional
        delay={0.24}
      >
        <textarea
          {...register('constraints')}
          rows={4}
          maxLength={800}
          placeholder={'家族の状況、お金のこと、住んでいる場所、今すぐ働く必要があるか…\n転職・就職を考える上での「今の現実」を自由に書いてください。\n\n例：「子どもが2人いて、貯金に余裕がない。地方在住で引越しは難しい。すぐに収入が必要。」'}
          className="w-full px-4 py-3 rounded-xl bg-oracle-800/60 border border-oracle-600/50 text-divine-100 placeholder:text-divine-300/40 focus:outline-none focus:border-gold-500/70 focus:ring-1 focus:ring-gold-500/30 transition-colors resize-none leading-relaxed"
        />
        <p className="text-xs text-divine-300/40">
          ここに書いた内容をもとに、AIがあなたの状況に合った「現実パス」を提案します。書かなくても診断は可能です。
        </p>
      </FieldWrapper>

      {/* 現在の職業または専攻分野 */}
      <FieldWrapper
        label="現在の職業または専攻分野"
        optional
        delay={0.30}
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
        delay={0.36}
      >
        <input
          type="text"
          {...register('fieldOfStudy')}
          placeholder="例: 工学部情報工学科、経済学部..."
          className="w-full px-4 py-3 rounded-xl bg-oracle-800/60 border border-oracle-600/50 text-divine-100 placeholder:text-divine-300/40 focus:outline-none focus:border-gold-500/70 focus:ring-1 focus:ring-gold-500/30 transition-colors"
        />
      </FieldWrapper>

      {/* 業界経験（複数入力可） */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.42, ease: 'easeOut' as const }}
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
              const current = watch('industryExperience') ?? [];
              setValue('industryExperience', [...current, { years: 1, field: '' }]);
            }}
            className="ml-auto px-4 py-1.5 rounded-full text-xs border transition-all bg-oracle-800/50 border-oracle-600/40 text-divine-300/60 hover:border-oracle-400/60"
          >
            + 経験を追加
          </button>
        </div>

        {(watch('industryExperience') ?? []).map((_, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="flex gap-3 items-center"
          >
            <div className="w-24 shrink-0">
              <select
                {...register(`industryExperience.${idx}.years`, { valueAsNumber: true })}
                className="w-full px-3 py-3 rounded-xl bg-oracle-800/60 border border-oracle-600/50 text-divine-100 focus:outline-none focus:border-gold-500/70 transition-colors"
              >
                {YEARS_OPTIONS.map((y) => (
                  <option key={y} value={y}>{y}年</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <input
                type="text"
                {...register(`industryExperience.${idx}.field`)}
                placeholder="例: IT・Webサービス、医療・製薬..."
                className="w-full px-4 py-3 rounded-xl bg-oracle-800/60 border border-oracle-600/50 text-divine-100 placeholder:text-divine-300/40 focus:outline-none focus:border-gold-500/70 transition-colors"
              />
            </div>
            <button
              type="button"
              onClick={() => {
                const current = watch('industryExperience') ?? [];
                setValue('industryExperience', current.filter((_, i) => i !== idx));
              }}
              className="shrink-0 w-9 h-9 flex items-center justify-center rounded-lg border border-oracle-600/40 text-divine-300/50 hover:text-red-400 hover:border-red-400/40 transition-colors"
              aria-label="この経験を削除"
            >
              ×
            </button>
          </motion.div>
        ))}
      </motion.div>

      {/* 送信ボタン */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.48, ease: 'easeOut' as const }}
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
