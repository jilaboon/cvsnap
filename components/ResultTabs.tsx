'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n';
import { GenerationOutput, BulletUpgrade } from '@/types';
import { CopyButton } from './CopyButton';

interface ResultTabsProps {
  data: GenerationOutput;
  onDownload: (format: 'docx' | 'pdf') => void;
}

type TabKey = 'report' | 'resume' | 'bullets' | 'linkedin';

export function ResultTabs({ data, onDownload }: ResultTabsProps) {
  const { t, isRTL } = useI18n();
  const [activeTab, setActiveTab] = useState<TabKey>('report');

  const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    {
      key: 'report',
      label: t('tabReport'),
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      key: 'resume',
      label: t('tabResume'),
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      key: 'bullets',
      label: t('tabBullets'),
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      key: 'linkedin',
      label: t('tabLinkedin'),
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      )
    },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return 'from-green-400 to-emerald-500';
    if (score >= 60) return 'from-yellow-400 to-orange-500';
    return 'from-red-400 to-rose-500';
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'report':
        return (
          <div className="flex flex-col gap-6" dir={isRTL ? 'rtl' : 'ltr'}>
            {/* Match Score Card */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{t('matchScore')}</p>
                  <p className="text-sm text-gray-500">{t('matchScoreDesc')}</p>
                </div>
                <div className="relative w-24 h-24">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="48" cy="48" r="40" stroke="#e0e7ff" strokeWidth="8" fill="none" />
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="url(#scoreGradient)"
                      strokeWidth="8"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 40}`}
                      strokeDashoffset={`${2 * Math.PI * 40 * (1 - (data.changeReport?.matchScore || 0) / 100)}`}
                    />
                    <defs>
                      <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`text-2xl font-bold ${getScoreColor(data.changeReport?.matchScore || 0)}`}>
                      {data.changeReport?.matchScore || 0}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-2xl font-bold text-gray-900">{data.changeReport?.skillsReordered?.length || 0}</span>
                </div>
                <p className="text-sm text-gray-600">{t('skillsHighlighted')}</p>
              </div>

              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  </div>
                  <span className="text-2xl font-bold text-gray-900">{data.changeReport?.keywordsAdded?.length || 0}</span>
                </div>
                <p className="text-sm text-gray-600">{t('keywordsAdded')}</p>
              </div>

              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                    <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <span className="text-2xl font-bold text-gray-900">{data.changeReport?.bulletImprovements || 0}</span>
                </div>
                <p className="text-sm text-gray-600">{t('bulletsImproved')}</p>
              </div>
            </div>

            {/* Summary Changes */}
            {data.changeReport?.summaryChanges && (
              <div className="bg-white rounded-xl p-5 border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  {t('summaryChanges')}
                </h4>
                <p className="text-sm text-gray-600">{data.changeReport.summaryChanges}</p>
              </div>
            )}

            {/* Skills & Keywords */}
            <div className="grid md:grid-cols-2 gap-4">
              {data.changeReport?.skillsReordered && data.changeReport.skillsReordered.length > 0 && (
                <div className="bg-white rounded-xl p-5 border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-3">{t('skillsHighlighted')}</h4>
                  <div className="flex flex-wrap gap-2">
                    {data.changeReport.skillsReordered.map((skill, i) => (
                      <span key={i} className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {data.changeReport?.keywordsAdded && data.changeReport.keywordsAdded.length > 0 && (
                <div className="bg-white rounded-xl p-5 border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-3">{t('keywordsAdded')}</h4>
                  <div className="flex flex-wrap gap-2">
                    {data.changeReport.keywordsAdded.map((keyword, i) => (
                      <span key={i} className="px-3 py-1 bg-green-50 text-green-700 text-sm rounded-full">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Key Insights */}
            {data.changeReport?.overallNotes && data.changeReport.overallNotes.length > 0 && (
              <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-5 border border-amber-100">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  {t('keyInsights')}
                </h4>
                <ul className="space-y-2">
                  {data.changeReport.overallNotes.map((note, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <svg className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      {note}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );

      case 'resume':
        return (
          <div className="flex flex-col gap-4">
            <pre
              className="whitespace-pre-wrap font-sans text-sm leading-relaxed bg-gray-50 p-6 rounded-xl overflow-auto max-h-[500px] border border-gray-100"
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              {data.tailoredResume}
            </pre>
            <div className="flex gap-3 flex-wrap">
              <CopyButton text={data.tailoredResume} />
              <button
                onClick={() => onDownload('docx')}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 rounded-lg transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {t('downloadDocx')}
              </button>
              <button
                onClick={() => onDownload('pdf')}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium btn-primary text-white rounded-lg"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                {t('downloadPdf')}
              </button>
            </div>
          </div>
        );

      case 'bullets':
        return (
          <div className="flex flex-col gap-4">
            <div
              className="bg-gray-50 p-6 rounded-xl overflow-auto max-h-[500px] border border-gray-100"
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              {data.bulletUpgrades.map((upgrade: BulletUpgrade, index: number) => (
                <div
                  key={index}
                  className="mb-6 pb-6 border-b border-gray-200 last:border-0 last:mb-0 last:pb-0"
                >
                  <p className="text-xs font-semibold text-indigo-600 mb-3 uppercase tracking-wide">
                    {upgrade.context}
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">
                        {t('original')}
                      </span>
                      <p className="text-sm text-gray-700">{upgrade.original}</p>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
                      <span className="text-xs font-semibold text-green-700 uppercase tracking-wide block mb-2">
                        {t('improved')}
                      </span>
                      <p className="text-sm text-gray-900 font-medium">{upgrade.improved}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <CopyButton
              text={data.bulletUpgrades
                .map(
                  (u: BulletUpgrade) =>
                    `${u.context}\nOriginal: ${u.original}\nImproved: ${u.improved}`
                )
                .join('\n\n')}
            />
          </div>
        );

      case 'linkedin':
        return (
          <div className="flex flex-col gap-4">
            <pre
              className="whitespace-pre-wrap font-sans text-sm leading-relaxed bg-gray-50 p-6 rounded-xl overflow-auto max-h-[500px] border border-gray-100"
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              {data.linkedinAbout}
            </pre>
            <CopyButton text={data.linkedinAbout} />
          </div>
        );
    }
  };

  return (
    <div className="w-full" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Tab navigation */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-xl mb-6 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`
              flex-1 min-w-[80px] flex items-center justify-center gap-2 px-3 py-3 text-sm font-medium rounded-lg transition-all whitespace-nowrap
              ${activeTab === tab.key ? 'tab-active' : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'}
            `}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      {renderContent()}
    </div>
  );
}
