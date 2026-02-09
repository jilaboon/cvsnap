'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { Language } from '@/types';

// Translation strings
const translations = {
  en: {
    title: 'CV Snap',
    subtitle: 'Tailor your resume in seconds',
    heroTitle1: 'Land Your Dream Job with a',
    heroTitle2: 'Perfect Resume',
    heroBadge: 'AI-Powered Resume Tailoring',
    heroDescPart1: 'Upload your CV, paste the job description, and get an',
    heroDescPart2: '-optimized resume in seconds.',
    uploadLabel: 'Upload your CV (PDF or DOCX)',
    uploadDrop: 'Drop file here or click to upload',
    uploadHint: 'PDF or DOCX, max 5MB',
    uploadSelected: 'Selected:',
    jobLabel: 'Paste Job Description',
    jobPlaceholder: 'Paste the job description here...',
    inputNote: 'Note: CV and job description must be in English',
    submitButton: 'Snap My Resume',
    processing: 'Analyzing your resume...',
    processingTime: 'This usually takes 30-60 seconds',
    step1: 'Extracting CV data',
    step2: 'Analyzing job requirements',
    step3: 'Generating tailored outputs',
    resultsTitle: 'Your Results',
    tabResume: 'Tailored Resume',
    tabBullets: 'Bullet Upgrades',
    tabLinkedin: 'LinkedIn About',
    tabReport: 'Change Report',
    copyButton: 'Copy to Clipboard',
    copied: 'Copied!',
    downloadDocx: 'Download DOCX',
    downloadPdf: 'Download PDF',
    backButton: 'Start Over',
    footer: 'Built with AI. Your data is never stored.',
    trustNoData: 'No data stored',
    trustFast: 'Results in seconds',
    trustAts: 'ATS-optimized',
    trustAtsPrefix: 'Optimized for',
    atsTitle: 'Applicant Tracking System (ATS)',
    atsDescription: 'Software used by 75% of companies to automatically scan and filter resumes before a human sees them.',
    atsWhy: 'Our optimization ensures your resume passes ATS screening by matching keywords and using proper formatting.',
    errorFile: 'Please upload a PDF or DOCX file',
    errorJob: 'Please paste a job description',
    errorProcess: 'Something went wrong. Please try again.',
    original: 'Original',
    improved: 'Improved',
    matchScore: 'Match Score',
    matchScoreDesc: 'How well your CV matches this job',
    summaryChanges: 'Summary Changes',
    skillsHighlighted: 'Skills Highlighted',
    keywordsAdded: 'ATS Keywords Added',
    bulletsImproved: 'Bullets Improved',
    keyInsights: 'Key Insights',
    changeFile: 'Change file',
    poweredBy: 'Powered by',
    termsOfUse: 'Terms of Use',
    privacyPolicy: 'Privacy Policy',
    // Usage & Upgrade
    usesRemaining: 'uses left',
    upgradeTitle: 'You\'ve used all your free snaps',
    upgradeDescription: 'Upgrade to keep tailoring your resume to every job you apply for.',
    tierStarter: 'Starter',
    tierStarterDesc: '10 resume tailors',
    tierPro: 'Pro',
    tierProDesc: '50 resume tailors',
    buyNow: 'Buy Now',
    bestValue: 'Best Value',
    purchaseSuccess: 'Purchase activated! You now have {0} uses.',
  },
  he: {
    title: 'CV Snap',
    subtitle: 'התאם את קורות החיים שלך בשניות',
    heroTitle1: 'קבל את העבודה שחלמת עליה עם',
    heroTitle2: 'קורות חיים מושלמים',
    heroBadge: 'התאמת קורות חיים מבוססת AI',
    heroDescPart1: 'העלה את קורות החיים שלך, הדבק את תיאור המשרה, וקבל קורות חיים מותאמים ל-',
    heroDescPart2: ' בשניות.',
    uploadLabel: 'העלה קורות חיים (PDF או DOCX)',
    uploadDrop: 'גרור קובץ לכאן או לחץ להעלאה',
    uploadHint: 'PDF או DOCX, עד 5MB',
    uploadSelected: 'נבחר:',
    jobLabel: 'הדבק תיאור משרה',
    jobPlaceholder: 'הדבק את תיאור המשרה כאן...',
    inputNote: 'שים לב: קורות החיים ותיאור המשרה חייבים להיות באנגלית',
    submitButton: 'התאם את קורות החיים',
    processing: 'מנתח את קורות החיים שלך...',
    processingTime: 'זה בדרך כלל לוקח 30-60 שניות',
    step1: 'מחלץ נתוני קורות חיים',
    step2: 'מנתח דרישות משרה',
    step3: 'מייצר תוצרים מותאמים',
    resultsTitle: 'התוצאות שלך',
    tabResume: 'קורות חיים מותאמים',
    tabBullets: 'שיפור נקודות',
    tabLinkedin: 'אודות לינקדאין',
    tabReport: 'דוח שינויים',
    copyButton: 'העתק ללוח',
    copied: 'הועתק!',
    downloadDocx: 'הורד DOCX',
    downloadPdf: 'הורד PDF',
    backButton: 'התחל מחדש',
    footer: 'נבנה עם AI. הנתונים שלך לעולם לא נשמרים.',
    trustNoData: 'ללא שמירת נתונים',
    trustFast: 'תוצאות בשניות',
    trustAts: 'מותאם ל-ATS',
    trustAtsPrefix: 'מותאם ל-',
    atsTitle: 'מערכת מעקב מועמדים (ATS)',
    atsDescription: 'תוכנה המשמשת 75% מהחברות לסריקה וסינון אוטומטי של קורות חיים לפני שאדם רואה אותם.',
    atsWhy: 'האופטימיזציה שלנו מבטיחה שקורות החיים שלך יעברו את סינון ה-ATS על ידי התאמת מילות מפתח ושימוש בפורמט נכון.',
    errorFile: 'אנא העלה קובץ PDF או DOCX',
    errorJob: 'אנא הדבק תיאור משרה',
    errorProcess: 'משהו השתבש. אנא נסה שוב.',
    original: 'מקור',
    improved: 'משופר',
    matchScore: 'ציון התאמה',
    matchScoreDesc: 'כמה קורות החיים שלך מתאימים למשרה',
    summaryChanges: 'שינויים בתקציר',
    skillsHighlighted: 'מיומנויות שהודגשו',
    keywordsAdded: 'מילות מפתח ATS שנוספו',
    bulletsImproved: 'נקודות ששופרו',
    keyInsights: 'תובנות מרכזיות',
    changeFile: 'החלף קובץ',
    poweredBy: 'מופעל על ידי',
    termsOfUse: 'תנאי שימוש',
    privacyPolicy: 'מדיניות פרטיות',
    // Usage & Upgrade
    usesRemaining: 'שימושים נותרו',
    upgradeTitle: 'השימושים החינמיים נגמרו',
    upgradeDescription: 'שדרג כדי להמשיך להתאים את קורות החיים שלך לכל משרה.',
    tierStarter: 'סטארטר',
    tierStarterDesc: '10 התאמות קורות חיים',
    tierPro: 'פרו',
    tierProDesc: '50 התאמות קורות חיים',
    buyNow: 'קנה עכשיו',
    bestValue: 'הכי משתלם',
    purchaseSuccess: 'הרכישה הופעלה! יש לך {0} שימושים.',
  },
} as const;

type TranslationKey = keyof typeof translations.en;

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
  isRTL: boolean;
}

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: TranslationKey): string => {
    return translations[language][key] || key;
  };

  const isRTL = language === 'he';

  return (
    <I18nContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
}
