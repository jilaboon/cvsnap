'use client';

import { useI18n } from '@/lib/i18n';
import { GROW_LINKS, TRANZILA_LINKS, PRICES, isIsraeliLocale } from '@/lib/usage';

interface UpgradeModalProps {
  onClose: () => void;
}

export function UpgradeModal({ onClose }: UpgradeModalProps) {
  const { t, isRTL, language } = useI18n();

  // Hebrew → NIS, English + Israeli locale → NIS, otherwise → USD
  const useNIS = language === 'he' || isIsraeliLocale();
  const prices = useNIS ? PRICES.nis : PRICES.usd;
  const links = useNIS ? GROW_LINKS : TRANZILA_LINKS;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
            <svg className="w-7 h-7 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {t('upgradeTitle')}
          </h2>
          <p className="text-gray-600">
            {t('upgradeDescription')}
          </p>
        </div>

        {/* Pricing cards */}
        <div className="grid grid-cols-2 gap-4">
          {/* Starter */}
          <div className="border border-gray-200 rounded-xl p-5 hover:border-indigo-300 hover:shadow-md transition-all">
            <h3 className="font-bold text-gray-900 text-lg mb-1">{t('tierStarter')}</h3>
            <div className="flex items-baseline gap-1 mb-3">
              <span className="text-3xl font-bold text-indigo-600">{prices.starter}</span>
            </div>
            <p className="text-sm text-gray-600 mb-4">{t('tierStarterDesc')}</p>
            <a
              href={links.starter}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-2.5 text-center text-sm font-semibold bg-white text-indigo-600 border-2 border-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
            >
              {t('buyNow')}
            </a>
          </div>

          {/* Pro */}
          <div className="border-2 border-indigo-500 rounded-xl p-5 relative shadow-md">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-indigo-600 text-white text-xs font-semibold rounded-full">
              {t('bestValue')}
            </div>
            <h3 className="font-bold text-gray-900 text-lg mb-1">{t('tierPro')}</h3>
            <div className="flex items-baseline gap-1 mb-3">
              <span className="text-3xl font-bold text-indigo-600">{prices.pro}</span>
            </div>
            <p className="text-sm text-gray-600 mb-4">{t('tierProDesc')}</p>
            <a
              href={links.pro}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-2.5 text-center text-sm font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              {t('buyNow')}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
