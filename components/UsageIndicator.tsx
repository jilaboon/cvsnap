'use client';

import { useI18n } from '@/lib/i18n';

interface UsageIndicatorProps {
  remaining: number;
  onClick?: () => void;
}

export function UsageIndicator({ remaining, onClick }: UsageIndicatorProps) {
  const { t } = useI18n();

  const colorClass =
    remaining === 0
      ? 'bg-red-50 text-red-700 border-red-200'
      : remaining <= 2
        ? 'bg-amber-50 text-amber-700 border-amber-200'
        : 'bg-indigo-50 text-indigo-700 border-indigo-200';

  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full border transition-colors hover:opacity-80 ${colorClass}`}
    >
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
      {remaining} {t('usesRemaining')}
    </button>
  );
}
