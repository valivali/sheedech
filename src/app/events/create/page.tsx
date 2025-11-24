"use client";

import { Suspense } from 'react';
import { EventCreate } from '@/components/Event';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { Loading } from '@/components/UI/Loading';

import styles from './page.module.scss';


function CreateEventContent() {
  return <EventCreate />;
}

export default function CreateEventPage() {
  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
        <div className={styles.container}>
          <Suspense fallback={<Loading variant="spinner" size="lg" text="Loading event creation..." />}>
            <CreateEventContent />
          </Suspense>
        </div>
      </main>
      <Footer />
    </div>
  );
}
