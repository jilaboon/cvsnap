'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n';

interface AtsTooltipProps {
  variant?: 'default' | 'inline';
}

export function AtsTooltip({ variant = 'default' }: AtsTooltipProps) {
  const { t, isRTL } = useI18n();
  const [isOpen, setIsOpen] = useState(false);

  if (variant === 'inline') {
    return (
      <span className="relative inline-flex items-center">
        <strong className="font-bold">ATS</strong>
        <button
          onClick={() => setIsOpen(!isOpen)}
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
          className="inline-flex items-center justify-center w-4 h-4 ml-0.5 bg-indigo-100 hover:bg-indigo-200 text-indigo-600 rounded-full transition-colors cursor-help"
          aria-label="What is ATS?"
        >
          <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        </button>

        {/* Tooltip popup */}
        {isOpen && (
          <span
            className={`absolute bottom-full mb-2 w-72 p-4 bg-gray-900 text-white text-sm rounded-xl shadow-xl z-50 ${
              isRTL ? 'right-0' : 'left-0'
            }`}
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            <span className="font-bold text-indigo-300 block mb-2">{t('atsTitle')}</span>
            <span className="text-gray-300 block mb-2">{t('atsDescription')}</span>
            <span className="text-gray-400 text-xs block">{t('atsWhy')}</span>
            {/* Arrow */}
            <span className={`absolute top-full ${isRTL ? 'right-4' : 'left-4'} w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-gray-900`} />
          </span>
        )}
      </span>
    );
  }

  return (
    <div className="relative inline-flex items-center">
      <span className="flex items-center gap-1.5">
        <span>{t('trustAtsPrefix')}</span>
        <strong className="font-bold">ATS</strong>
        <button
          onClick={() => setIsOpen(!isOpen)}
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
          className="inline-flex items-center justify-center w-5 h-5 bg-indigo-100 hover:bg-indigo-200 text-indigo-600 rounded-full transition-colors cursor-help"
          aria-label="What is ATS?"
        >
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        </button>
      </span>

      {/* Tooltip popup */}
      {isOpen && (
        <div
          className={`absolute bottom-full mb-2 w-72 p-4 bg-gray-900 text-white text-sm rounded-xl shadow-xl z-50 ${
            isRTL ? 'right-0' : 'left-0'
          }`}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <div className="font-bold text-indigo-300 mb-2">{t('atsTitle')}</div>
          <p className="text-gray-300 mb-2">{t('atsDescription')}</p>
          <p className="text-gray-400 text-xs">{t('atsWhy')}</p>
          {/* Arrow */}
          <div className={`absolute top-full ${isRTL ? 'right-4' : 'left-4'} w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-gray-900`} />
        </div>
      )}
    </div>
  );
}
