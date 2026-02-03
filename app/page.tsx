'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n';
import { LanguageToggle } from '@/components/LanguageToggle';
import { FileUpload } from '@/components/FileUpload';
import { JobInput } from '@/components/JobInput';
import { LoadingState } from '@/components/LoadingState';
import { ResultTabs } from '@/components/ResultTabs';
import { GenerationOutput } from '@/types';
import { AtsTooltip } from '@/components/AtsTooltip';
import Image from 'next/image';

type AppState = 'form' | 'loading' | 'results';

export default function Home() {
  const { t, isRTL, language } = useI18n();

  const [state, setState] = useState<AppState>('form');
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [loadingStep, setLoadingStep] = useState(0);
  const [results, setResults] = useState<GenerationOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!file) {
      setError(t('errorFile'));
      return;
    }
    if (!jobDescription.trim()) {
      setError(t('errorJob'));
      return;
    }

    setError(null);
    setState('loading');
    setLoadingStep(0);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('jobDescription', jobDescription);
      formData.append('language', language);

      const stepInterval = setInterval(() => {
        setLoadingStep((prev) => Math.min(prev + 1, 2));
      }, 12000);

      const response = await fetch('/api/process', {
        method: 'POST',
        body: formData,
      });

      clearInterval(stepInterval);

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || t('errorProcess'));
      }

      setResults(data.data);
      setState('results');
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errorProcess'));
      setState('form');
    }
  };

  const handleDownload = async (format: 'docx' | 'pdf') => {
    if (!results) return;

    const formData = new FormData();
    formData.append('resumeText', results.tailoredResume);
    formData.append('language', language);
    formData.append('downloadFormat', format);

    try {
      const response = await fetch('/api/process', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Download failed');

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tailored-resume.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download error:', err);
    }
  };

  const handleStartOver = () => {
    setState('form');
    setFile(null);
    setJobDescription('');
    setResults(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-main" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-indigo-100 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="CV Snap Logo"
              width={56}
              height={56}
              priority
            />
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
              {t('title')}
            </span>
          </div>
          <LanguageToggle />
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        {state === 'form' && (
          <div className="flex flex-col items-center gap-10">
            {/* Hero */}
            <div className="text-center max-w-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium mb-6">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
                {t('heroBadge')}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                {t('heroTitle1')}{' '}
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  {t('heroTitle2')}
                </span>
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed">
                {t('heroDescPart1')} <AtsTooltip variant="inline" />{t('heroDescPart2')}
              </p>
            </div>

            {/* Form Card */}
            <div className="w-full card p-8">
              <div className="flex flex-col gap-6">
                <FileUpload onFileSelect={setFile} selectedFile={file} />
                <JobInput value={jobDescription} onChange={setJobDescription} />

                {/* Note about English only */}
                <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-100 rounded-xl text-amber-700">
                  <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm">{t('inputNote')}</p>
                </div>

                {error && (
                  <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-100 rounded-xl text-red-700">
                    <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm">{error}</p>
                  </div>
                )}

                <button
                  onClick={handleSubmit}
                  className="w-full py-4 btn-primary text-white font-semibold rounded-xl text-lg"
                >
                  {t('submitButton')}
                </button>
              </div>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>{t('trustNoData')}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
                <span>{t('trustFast')}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <AtsTooltip />
              </div>
            </div>
          </div>
        )}

        {state === 'loading' && (
          <div className="card p-12">
            <LoadingState currentStep={loadingStep} />
          </div>
        )}

        {state === 'results' && results && (
          <div className="flex flex-col gap-6">
            <button
              onClick={handleStartOver}
              className="self-start flex items-center gap-2 text-sm text-gray-600 hover:text-indigo-600 font-medium"
            >
              <svg className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              {t('backButton')}
            </button>

            <div className="card p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                {t('resultsTitle')}
              </h2>
              <ResultTabs data={results} onDownload={handleDownload} />
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-sm text-gray-500">
        <p>{t('footer')}</p>
      </footer>
    </div>
  );
}
