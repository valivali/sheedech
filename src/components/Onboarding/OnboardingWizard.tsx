"use client";

import { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { PersonalInfoStep } from './Steps/PersonalInfo/PersonalInfoStep';
import { HostPreferencesStep } from './Steps/HostPreferences/HostPreferencesStep';
import { GuestPreferencesStep } from './Steps/GuestPreferences/GuestPreferencesStep';
import { OnboardingCompleteStep } from './Steps/OnboardingComplete/OnboardingCompleteStep';
import { useOnboardingData } from '@/api/frontend/onboarding';
import { Loading } from '@/components/UI/Loading';
import { Text } from '@/components/UI/Text';
import { ProgressBar } from '@/components/UI/ProgressBar';
import styles from './OnboardingWizard.module.scss';
import { match } from 'ts-pattern';

const StepNavigation = memo(({
  currentStep,
  completedSteps,
  onGoToStep
}: {
  currentStep: WizardStep;
  completedSteps: number;
  onGoToStep: (step: WizardStep) => void;
}) => (
  <div className={styles.stepNavigation}>
    {STEP_ORDER.map((step, index) => {
      const isCompleted = index < completedSteps;
      const isCurrent = step === currentStep;
      const isAccessible = index <= completedSteps;

      return (
        <button
          key={step}
          onClick={() => onGoToStep(step)}
          disabled={!isAccessible}
          className={`${styles.stepButton} ${isCurrent ? styles.stepButtonActive : ''} ${isCompleted ? styles.stepButtonCompleted : ''}`}
          type="button"
        >
          {index + 1}. {step === 'personal-info' ? 'Personal Info' : step === 'host-preferences' ? 'Host Preferences' : step === 'guest-preferences' ? 'Guest Preferences' : 'Complete'}
        </button>
      );
    })}
  </div>
));

StepNavigation.displayName = 'StepNavigation';

export type WizardStep = 'personal-info' | 'host-preferences' | 'guest-preferences' | 'onboarding-complete';

const STEP_ORDER: WizardStep[] = ['personal-info', 'host-preferences', 'guest-preferences', 'onboarding-complete'];

export const OnboardingWizard = () => {
  const { data: onboardingData, isLoading, error } = useOnboardingData();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState<WizardStep>('personal-info');

  useEffect(() => {
    if (!onboardingData) return;

    const urlStep = searchParams?.get('step') as WizardStep | null;

    // If URL has a valid step and user has completed up to that step, use it
    if (urlStep && STEP_ORDER.includes(urlStep)) {
      const urlStepIndex = STEP_ORDER.indexOf(urlStep);
      if (urlStepIndex <= onboardingData.completedSteps) {
        setCurrentStep(urlStep);
        return;
      }
    }

    // Otherwise, go to the furthest completed step
    const stepIndex = Math.min(onboardingData.completedSteps, STEP_ORDER.length - 1);
    setCurrentStep(STEP_ORDER[stepIndex]);
  }, [onboardingData, searchParams]);

  // Scroll to top when step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  const handleNextStep = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['onboarding'] });
    const currentIndex = STEP_ORDER.indexOf(currentStep);
    // Don't advance from the completion step
    if (currentIndex < STEP_ORDER.length - 1 && currentStep !== 'onboarding-complete') {
      setCurrentStep(STEP_ORDER[currentIndex + 1]);
    }
  }, [queryClient, currentStep]);

  const handleGoToStep = useCallback((step: WizardStep) => {
    const targetIndex = STEP_ORDER.indexOf(step);
    const completedSteps = onboardingData?.completedSteps || 0;

    if (targetIndex <= completedSteps) {
      setCurrentStep(step);
    }
  }, [onboardingData?.completedSteps]);

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
          <StepNavigation
            currentStep={currentStep}
            completedSteps={onboardingData.completedSteps}
            onGoToStep={handleGoToStep}
          />
        )}
      </div>

      <div className={styles.wizardContent}>
        {
          match(currentStep)
          .with('personal-info', () => (
            <PersonalInfoStep 
              onNext={handleNextStep} 
              initialData={onboardingData?.personalInfo}
            />
          ))
          .with('host-preferences', () => (
            <HostPreferencesStep 
              onNext={handleNextStep}
              onBack={() => setCurrentStep('personal-info')}
              initialData={onboardingData?.hostPreferences}
            />
          ))
          .with('guest-preferences', () => (
            <GuestPreferencesStep 
              onNext={handleNextStep}
              onBack={() => setCurrentStep('host-preferences')}
              initialData={onboardingData?.guestPreferences}
            />
          ))
          .with('onboarding-complete', () => (
            <OnboardingCompleteStep />
          ))
          .exhaustive()
        }
      </div>
    </div>
  );
};

