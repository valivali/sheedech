"use client";

import { Suspense } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/lib/auth";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Title, Text } from "@/components/UI/Text";
import { Loading } from "@/components/UI/Loading";
import styles from "./Dashboard.module.scss";

function DashboardContent() {
  const { user } = useUser();
  const router = useRouter();

  const handleHostEventClick = () => {
    router.push("/events/create");
  };

  return (
    <>
      <div className={styles.welcomeSection}>
        <Title level={1}>Welcome back, {user?.firstName}!</Title>
        <Text className={styles.subtitle}>
          You're now part of the Sheedech community.
        </Text>
      </div>

      <div className={styles.dashboardGrid}>
        <div className={styles.card}>
          <Title level={3}>Upcoming Events</Title>
          <Text>
            Discover community gatherings and dinners near you.
          </Text>
        </div>

        <div className={`${styles.card} ${styles.clickableCard}`} onClick={handleHostEventClick}>
          <Title level={3}>Host an Event</Title>
          <Text>
            Open your home and create meaningful connections.
          </Text>
        </div>

        <div className={styles.card}>
          <Title level={3}>Your Connections</Title>
          <Text>
            See the friends you've made in the community.
          </Text>
        </div>
      </div>
    </>
  );
}

export default function Dashboard() {
  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
        <div className={styles.container}>
          <Suspense fallback={<Loading variant="spinner" size="lg" text="Loading your dashboard..." />}>
            <DashboardContent />
          </Suspense>
        </div>
      </main>
      <Footer />
    </div>
  );
}

