"use client";

import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { PersonalInfoStep } from './Steps/PersonalInfoStep';
import { HostPreferencesStep } from './Steps/HostPreferencesStep';
import { GuestPreferencesStep } from './Steps/GuestPreferencesStep';
import { OnboardingCompleteStep } from './Steps/OnboardingCompleteStep';
import { useOnboardingData } from '@/api/frontend/onboarding';
import { Loading } from '@/components/UI/Loading';
import { Text } from '@/components/UI/Text';
import { ProgressBar } from '@/components/UI/ProgressBar';
import styles from './OnboardingWizard.module.scss';

export type WizardStep = 'personal-info' | 'host-preferences' | 'guest-preferences' | 'onboarding-complete';

const STEP_ORDER: WizardStep[] = ['personal-info', 'host-preferences', 'guest-preferences', 'onboarding-complete'];

export const OnboardingWizard = () => {
  const { data: onboardingData, isLoading, error } = useOnboardingData();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState<WizardStep>('personal-info');

  useEffect(() => {
    if (onboardingData) {
      const urlStep = searchParams?.get('step') as WizardStep | null;

      if (urlStep && STEP_ORDER.includes(urlStep)) {
        const urlStepIndex = STEP_ORDER.indexOf(urlStep);
        if (urlStepIndex <= onboardingData.completedSteps) {
          setCurrentStep(urlStep);
          return;
        }
      }

      const stepIndex = Math.min(onboardingData.completedSteps, STEP_ORDER.length - 1);
      setCurrentStep(STEP_ORDER[stepIndex]);
    }
  }, [onboardingData, searchParams]);

  // Scroll to top when step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  const handleNextStep = () => {
    queryClient.invalidateQueries({ queryKey: ['onboarding'] });
    const currentIndex = STEP_ORDER.indexOf(currentStep);
    // Don't advance from the completion step
    if (currentIndex < STEP_ORDER.length - 1 && currentStep !== 'onboarding-complete') {
      setCurrentStep(STEP_ORDER[currentIndex + 1]);
    }
  };

  const handleGoToStep = (step: WizardStep) => {
    const targetIndex = STEP_ORDER.indexOf(step);
    const completedSteps = onboardingData?.completedSteps || 0;
    
    if (targetIndex <= completedSteps) {
      setCurrentStep(step);
    }
  };

  const currentStepIndex = STEP_ORDER.indexOf(currentStep);
  const progressPercentage = ((currentStepIndex + 1) / STEP_ORDER.length) * 100;

  if (isLoading) {
    return <Loading variant="spinner" size="lg" text="Loading your progress..." />;
  }

  if (error) {
    return (
      <div className={styles.error}>
        <Text>Failed to load onboarding data. Please refresh the page.</Text>
      </div>
    );
  }

  return (
    <div className={styles.wizard}>
      <div className={styles.wizardHeader}>
        <ProgressBar fulfilled={progressPercentage / 100} />
        <div className={styles.stepIndicator}>
          Step {currentStepIndex + 1} of {STEP_ORDER.length}
        </div>

        {onboardingData && onboardingData.completedSteps > 0 && (
          <div className={styles.stepNavigation}>
            {STEP_ORDER.map((step, index) => {
              const isCompleted = index < (onboardingData.completedSteps || 0);
              const isCurrent = step === currentStep;
              const isAccessible = index <= (onboardingData.completedSteps || 0);
              
              return (
                <button
                  key={step}
                  onClick={() => handleGoToStep(step)}
                  disabled={!isAccessible}
                  className={`${styles.stepButton} ${isCurrent ? styles.stepButtonActive : ''} ${isCompleted ? styles.stepButtonCompleted : ''}`}
                  type="button"
                >
                  {index + 1}. {step === 'personal-info' ? 'Personal Info' : step === 'host-preferences' ? 'Host Preferences' : step === 'guest-preferences' ? 'Guest Preferences' : 'Complete'}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className={styles.wizardContent}>
        {currentStep === 'personal-info' && (
          <PersonalInfoStep 
            onNext={handleNextStep} 
            initialData={onboardingData?.personalInfo}
          />
        )}
        {currentStep === 'host-preferences' && (
          <HostPreferencesStep 
            onNext={handleNextStep}
            onBack={() => setCurrentStep('personal-info')}
            initialData={onboardingData?.hostPreferences}
          />
        )}
        {currentStep === 'guest-preferences' && (
          <GuestPreferencesStep
            onNext={handleNextStep}
            onBack={() => setCurrentStep('host-preferences')}
            initialData={onboardingData?.guestPreferences}
          />
        )}
        {currentStep === 'onboarding-complete' && (
          <OnboardingCompleteStep />
        )}
      </div>
    </div>
  );
};

