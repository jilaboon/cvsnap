'use client';

import { useI18n } from '@/lib/i18n';
import Link from 'next/link';

const content = {
  en: {
    title: 'Privacy Policy',
    lastUpdated: 'Last updated: February 2025',
    sections: [
      {
        title: 'Data Collection',
        content: 'We do not store your CV, job descriptions, or generated content. All processing happens in real-time and data is discarded after your session.',
      },
      {
        title: 'Data Processing',
        content: 'Your data is processed using AI services to generate tailored resumes. This processing occurs only during your active session.',
      },
      {
        title: 'Cookies',
        content: 'We use minimal cookies only for essential site functionality. No tracking or advertising cookies are used.',
      },
      {
        title: 'Third-Party Services',
        content: 'We use Anthropic\'s Claude AI for processing. Your data is subject to their privacy practices during processing.',
      },
      {
        title: 'Your Rights',
        content: 'Since we do not store personal data, there is no data to access, modify, or delete. Each session is independent.',
      },
    ],
    contact: 'For privacy inquiries, contact us at:',
  },
  he: {
    title: 'מדיניות פרטיות',
    lastUpdated: 'עודכן לאחרונה: פברואר 2025',
    sections: [
      {
        title: 'איסוף נתונים',
        content: 'איננו שומרים את קורות החיים שלך, תיאורי המשרה, או התוכן שנוצר. כל העיבוד מתרחש בזמן אמת והנתונים נמחקים לאחר הסשן שלך.',
      },
      {
        title: 'עיבוד נתונים',
        content: 'הנתונים שלך מעובדים באמצעות שירותי AI ליצירת קורות חיים מותאמים. עיבוד זה מתרחש רק במהלך הסשן הפעיל שלך.',
      },
      {
        title: 'עוגיות',
        content: 'אנו משתמשים בעוגיות מינימליות רק לפונקציונליות חיונית של האתר. לא נעשה שימוש בעוגיות מעקב או פרסום.',
      },
      {
        title: 'שירותי צד שלישי',
        content: 'אנו משתמשים ב-Claude AI של Anthropic לעיבוד. הנתונים שלך כפופים למדיניות הפרטיות שלהם במהלך העיבוד.',
      },
      {
        title: 'הזכויות שלך',
        content: 'מכיוון שאיננו שומרים נתונים אישיים, אין נתונים לגשת אליהם, לשנות או למחוק. כל סשן הוא עצמאי.',
      },
    ],
    contact: 'לשאלות בנושא פרטיות, צור קשר בכתובת:',
  },
};

export default function PrivacyPage() {
  const { language, isRTL } = useI18n();
  const t = content[language];

  return (
    <div className="min-h-screen bg-gradient-main" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-3xl mx-auto px-6 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-indigo-600 mb-8"
        >
          <svg className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          {isRTL ? 'חזרה לדף הבית' : 'Back to Home'}
        </Link>

        <div className="card p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t.title}</h1>
          <p className="text-sm text-gray-500 mb-8">{t.lastUpdated}</p>

          <div className="space-y-6">
            {t.sections.map((section, index) => (
              <div key={index}>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">{section.title}</h2>
                <p className="text-gray-600 leading-relaxed">{section.content}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 pt-6 border-t border-gray-200">
            <p className="text-gray-600 mb-2">{t.contact}</p>
            <a
              href="mailto:gillavon@gmail.com"
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              gillavon@gmail.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
