'use client';

import { useI18n } from '@/lib/i18n';
import Link from 'next/link';

const content = {
  en: {
    title: 'Terms of Use',
    lastUpdated: 'Last updated: February 2025',
    sections: [
      {
        title: 'Acceptance of Terms',
        content: 'By using CV Snap, you agree to these terms. If you do not agree, please do not use the service.',
      },
      {
        title: 'Service Description',
        content: 'CV Snap is an AI-powered tool that helps tailor resumes to job descriptions. The service is provided "as is" without warranties.',
      },
      {
        title: 'User Responsibilities',
        content: 'You are responsible for the accuracy of the information you provide. Do not upload content that is illegal, harmful, or infringes on others\' rights.',
      },
      {
        title: 'Intellectual Property',
        content: 'You retain ownership of your content. The AI-generated outputs are provided for your personal use.',
      },
      {
        title: 'Limitations',
        content: 'We are not liable for any damages arising from the use of this service. Results may vary and are not guaranteed.',
      },
    ],
  },
  he: {
    title: 'תנאי שימוש',
    lastUpdated: 'עודכן לאחרונה: פברואר 2025',
    sections: [
      {
        title: 'קבלת התנאים',
        content: 'בשימוש ב-CV Snap, אתה מסכים לתנאים אלה. אם אינך מסכים, אנא אל תשתמש בשירות.',
      },
      {
        title: 'תיאור השירות',
        content: 'CV Snap הוא כלי מבוסס AI שעוזר להתאים קורות חיים לתיאורי משרה. השירות מסופק "כמות שהוא" ללא אחריות.',
      },
      {
        title: 'אחריות המשתמש',
        content: 'אתה אחראי לדיוק המידע שאתה מספק. אל תעלה תוכן שהוא בלתי חוקי, מזיק, או פוגע בזכויות אחרים.',
      },
      {
        title: 'קניין רוחני',
        content: 'אתה שומר על הבעלות על התוכן שלך. התוצרים שנוצרו על ידי ה-AI מסופקים לשימושך האישי.',
      },
      {
        title: 'הגבלות',
        content: 'איננו אחראים לכל נזק הנובע משימוש בשירות זה. התוצאות עשויות להשתנות ואינן מובטחות.',
      },
    ],
  },
};

export default function TermsPage() {
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
        </div>
      </div>
    </div>
  );
}
