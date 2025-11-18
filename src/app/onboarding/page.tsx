"use client";

import { Suspense } from 'react';
import { OnboardingWizard } from '@/components/Onboarding';
import { Header } from '@/components/Header';
import { Loading } from '@/components/UI/Loading';
import styles from './page.module.scss';

function OnboardingContent() {
  return <OnboardingWizard />;
}

export default function OnboardingPage() {
  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
        <div className={styles.container}>
          <Suspense fallback={<Loading variant="spinner" size="lg" text="Loading onboarding..." />}>
            <OnboardingContent />
          </Suspense>
        </div>
      </main>
    </div>
  );
}

