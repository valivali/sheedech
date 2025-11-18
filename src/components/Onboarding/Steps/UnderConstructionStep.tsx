"use client";

import { useRouter } from 'next/navigation';
import { Title, Text } from '@/components/UI/Text';
import { Button } from '@/components/UI/Button';
import { useCompleteOnboarding } from '@/api/frontend/onboarding';
import styles from './UnderConstructionStep.module.scss';

interface UnderConstructionStepProps {
  onBack?: () => void;
}

export const UnderConstructionStep = ({ onBack }: UnderConstructionStepProps) => {
  const router = useRouter();
  const { mutate: completeOnboarding, isLoading } = useCompleteOnboarding();

  const handleComplete = () => {
    completeOnboarding(undefined, {
      onSuccess: () => {
        router.push('/dashboard');
      },
      onError: (error) => {
        console.error('Failed to complete onboarding:', error);
      },
    });
  };

  return (
    <div className={styles.container}>
      <Title level={2}>Almost Done!</Title>
      <Text>Thank you for completing the personal information step.</Text>
      <Text>More features will be available here soon!</Text>
      
      <div className={styles.actions}>
        {onBack && (
          <Button onClick={onBack} variant="secondary" disabled={isLoading}>
            Back
          </Button>
        )}
        <Button onClick={handleComplete} variant="primary" isLoading={isLoading}>
          Complete Onboarding
        </Button>
      </div>
    </div>
  );
};

