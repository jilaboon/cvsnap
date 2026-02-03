'use client';

import { useEffect, useState } from 'react';
import { useI18n } from '@/lib/i18n';

interface LoadingStateProps {
  currentStep: number;
}

export function LoadingState({ currentStep }: LoadingStateProps) {
  const { t, isRTL } = useI18n();
  const [progress, setProgress] = useState(0);

  const steps = [
    { key: 'step1', label: t('step1'), targetProgress: 30 },
    { key: 'step2', label: t('step2'), targetProgress: 60 },
    { key: 'step3', label: t('step3'), targetProgress: 92 },
  ];

  // Smooth progress animation - spans ~25 seconds per step
  useEffect(() => {
    const targetProgress = steps[Math.min(currentStep, 2)]?.targetProgress || 0;

    const duration = 22000; // 22 seconds to animate within each step
    const startTime = Date.now();
    const startValue = progress;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progressRatio = Math.min(elapsed / duration, 1);
      // Slower ease-out curve for more gradual progress
      const easeOut = 1 - Math.pow(1 - progressRatio, 2);
      const newProgress = startValue + (targetProgress - startValue) * easeOut;

      setProgress(Math.min(newProgress, targetProgress));

      if (progressRatio < 1) {
        requestAnimationFrame(animate);
      }
    };

    const animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [currentStep]);

  return (
    <div
      className="flex flex-col items-center justify-center min-h-[450px] gap-8"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Progress circle */}
      <div className="relative w-32 h-32">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="64"
            cy="64"
            r="56"
            stroke="#e0e7ff"
            strokeWidth="8"
            fill="none"
          />
          <circle
            cx="64"
            cy="64"
            r="56"
            stroke="url(#gradient)"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 56}`}
            strokeDashoffset={`${2 * Math.PI * 56 * (1 - progress / 100)}`}
            className="transition-all duration-300"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl font-bold text-gray-900">{Math.round(progress)}%</span>
        </div>
      </div>

      {/* Processing text */}
      <div className="text-center">
        <p className="text-xl font-semibold text-gray-900 mb-2">{t('processing')}</p>
        <p className="text-sm text-gray-500">{t('processingTime')}</p>
      </div>

      {/* Steps */}
      <div className="flex flex-col gap-4 w-full max-w-sm">
        {steps.map((step, index) => (
          <div key={step.key} className="flex items-center gap-4">
            <div className={`
              w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500
              ${index < currentStep
                ? 'bg-gradient-to-br from-green-400 to-emerald-500 scale-100'
                : index === currentStep
                  ? 'bg-gradient-to-br from-indigo-500 to-purple-600 scale-110'
                  : 'bg-gray-200 scale-100'
              }
            `}>
              {index < currentStep ? (
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              ) : index === currentStep ? (
                <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
              ) : (
                <div className="w-3 h-3 bg-gray-400 rounded-full" />
              )}
            </div>
            <div className="flex-1">
              <span className={`text-sm font-medium block ${
                index <= currentStep ? 'text-gray-900' : 'text-gray-400'
              }`}>
                {step.label}
              </span>
              {index === currentStep && (
                <div className="mt-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-300"
                    style={{ width: `${((progress - (steps[index - 1]?.targetProgress || 0)) / (step.targetProgress - (steps[index - 1]?.targetProgress || 0))) * 100}%` }}
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
