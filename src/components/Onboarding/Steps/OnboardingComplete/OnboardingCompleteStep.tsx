"use client";

import { useRouter } from 'next/navigation';
import { Title, Text } from '@/components/UI/Text';
import { Button } from '@/components/UI/Button';
import { FireworksBackground } from '@/components/UI/Fireworks';
import { useCompleteOnboarding } from '@/api/frontend/onboarding';
import styles from './OnboardingCompleteStep.module.scss';

export const OnboardingCompleteStep = () => {
  const router = useRouter();
  const { mutate: completeOnboarding, isPending } = useCompleteOnboarding();

  const handleCompleteOnboarding = () => {
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
      <FireworksBackground className={styles.fireworks} />

      <div className={styles.content}>
        <div className={styles.quoteContainer}>
          <Title level={2} className={styles.mainTitle}>
            We are all set!
          </Title>

          <Text className={styles.description}>
            You've successfully completed your onboarding. You're now ready to connect with amazing hosts and guests in your community.
          </Text>

          <blockquote className={styles.quote}>
            "When people share who they are, the world becomes a little brighter. Thanks for lighting up this corner."
          </blockquote>
        </div>

        <div className={styles.actions}>
          <Button
            onClick={handleCompleteOnboarding}
            disabled={isPending}
            size="md"
          >
            {isPending ? 'Completing...' : 'Go to Dashboard'}
          </Button>
        </div>
      </div>
    </div>
  );
};
