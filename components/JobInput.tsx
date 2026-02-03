'use client';

import { useI18n } from '@/lib/i18n';

interface JobInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function JobInput({ value, onChange }: JobInputProps) {
  const { t, isRTL } = useI18n();

  return (
    <div className="w-full" dir={isRTL ? 'rtl' : 'ltr'}>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {t('jobLabel')}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t('jobPlaceholder')}
        rows={8}
        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all text-gray-900 placeholder:text-gray-400"
        dir={isRTL ? 'rtl' : 'ltr'}
      />
    </div>
  );
}
