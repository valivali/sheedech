"use client";

import { Suspense } from "react";
import styles from "./Home.module.scss";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Title, Subtitle, Blockquote, Text } from "@/components/UI/Text";
import { Button } from "@/components/UI/Button";
import { Loading } from "@/components/UI/Loading";
import { EventCardCarousel } from "@/components/EventCard";
import { useRouter } from "next/navigation";
import { useUser, SignUpButton } from "@/lib/auth";
import { useEvents } from "@/api/frontend/events";

function HeroContent() {
  const router = useRouter();
  const { isSignedIn } = useUser();

  return (
    <>
      {isSignedIn ? (
        <Button variant="primary" onClick={() => router.push("/dashboard")}>
          Go to Dashboard
        </Button>
      ) : (
        <SignUpButton mode="modal">
          <Button variant="primary">Join Our Community</Button>
        </SignUpButton>
      )}
    </>
  );
}

function CTAContent() {
  const router = useRouter();
  const { isSignedIn } = useUser();

  return (
    <>
      {isSignedIn ? (
        <Button variant="primary" onClick={() => router.push("/dashboard")}>
          Get Started
        </Button>
      ) : (
        <SignUpButton mode="modal">
          <Button variant="primary">Get Started</Button>
        </SignUpButton>
      )}
    </>
  );
}

function EventsCarousel() {
  const { data: events, isLoading, error } = useEvents(6);

  if (isLoading) {
    return <Loading variant="pulse" size="md" text="Loading events..." />;
  }

  if (error || !events || events.length === 0) {
    return (
      <Text variant="div" className={styles.noEvents}>
        No upcoming events at the moment. Check back soon!
      </Text>
    );
  }

  return <EventCardCarousel events={events} />;
}

export default function Home() {
  const router = useRouter();

  return (
    <div className={styles.page}>
      <Header />

      <main>
        <section className={styles.hero}>
          <div className={styles.container}>
            <Title level={1} className={styles.heroTitle}>
              Welcome Home to Our Community
            </Title>
            <Subtitle className={styles.heroSubtitle}>
              Where neighbors become family, one meal at a time. Share moments, create memories, and strengthen the bonds that make our community special.
            </Subtitle>
            <Suspense fallback={<Loading variant="pulse" size="sm" />}>
              <HeroContent />
            </Suspense>
          </div>
        </section>

        <section id="mission" className={styles.mission}>
          <div className={styles.container}>
            <Blockquote>
              The tradition of hospitality is the foundation of community. When we open our doors, we open our hearts.
            </Blockquote>
            
            <div className={styles.missionContent}>
              <Title level={2}>Building Connections Through Shared Experiences</Title>
              <Text variant="div" className={styles.missionText}>
                Our community thrives when we come together. Sheedech creates meaningful opportunities for neighbors to connect over shared meals, celebrate traditions, and forge lasting friendships.
              </Text>
              <Text variant="div" className={styles.missionText}>
                Whether it's a Friday night dinner, a holiday celebration, or a simple gathering, every shared moment strengthens the fabric of our community and creates a place we're all proud to call home.
              </Text>
            </div>
          </div>
        </section>

        <section className={styles.events}>
          <div className={styles.container}>
            <Title level={2} className={styles.sectionTitle}>Upcoming Events</Title>
            <Text variant="div" className={styles.sectionSubtitle}>
              Discover community gatherings and dinners near you
            </Text>
            <Suspense fallback={<Loading variant="pulse" size="sm" />}>
              <EventsCarousel />
            </Suspense>
          </div>
        </section>

        <section className={styles.testimonials}>
          <div className={styles.container}>
            <Title level={2} className={styles.sectionTitle}>Community Stories</Title>
            
            <div className={styles.testimonialGrid}>
              <div className={styles.testimonialCard}>
                <Text variant="div" className={styles.testimonialText}>
                  "I moved here not knowing anyone. Through Sheedech, I've found a second family. The warmth and acceptance I've experienced has made this truly feel like home."
                </Text>
                <div className={styles.testimonialAuthor}>
                  <strong>Sarah M.</strong>
                  <span>Community Member</span>
                </div>
              </div>

              <div className={styles.testimonialCard}>
                <Text variant="div" className={styles.testimonialText}>
                  "Hosting dinners has brought so much joy to my life. Meeting new people, sharing stories, and watching friendships bloom around my table is incredibly fulfilling."
                </Text>
                <div className={styles.testimonialAuthor}>
                  <strong>David L.</strong>
                  <span>Regular Host</span>
                </div>
              </div>

              <div className={styles.testimonialCard}>
                <Text variant="div" className={styles.testimonialText}>
                  "As a young professional, it was hard to build connections. Sheedech made it easy and natural. I've met amazing people and feel truly part of something special."
                </Text>
                <div className={styles.testimonialAuthor}>
                  <strong>Rachel K.</strong>
                  <span>Community Member</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.values}>
          <div className={styles.container}>
            <Title level={2} className={styles.sectionTitle}>Our Vision</Title>
            
            <div className={styles.valueGrid}>
              <div className={styles.valueCard}>
                <Title level={3}>Connection</Title>
                <Text variant="div">Breaking down barriers and bringing people together through the universal language of hospitality and shared meals.</Text>
              </div>

              <div className={styles.valueCard}>
                <Title level={3}>Tradition</Title>
                <Text variant="div">Honoring our heritage while creating new memories that will be cherished for generations to come.</Text>
              </div>

              <div className={styles.valueCard}>
                <Title level={3}>Community</Title>
                <Text variant="div">Building a supportive network where everyone belongs and every voice is valued.</Text>
              </div>

              <div className={styles.valueCard}>
                <Title level={3}>Growth</Title>
                <Text variant="div">Fostering personal connections that enrich our lives and strengthen our collective spirit.</Text>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.cta}>
          <div className={styles.container}>
            <Blockquote author="Henrik Ibsen">
              A community is like a ship; everyone ought to be prepared to take the helm.
            </Blockquote>
            
            <Title level={2} className={styles.ctaTitle}>Be Part of Something Beautiful</Title>
            <Text variant="div" className={styles.ctaDescription}>
              Whether you're looking to host a gathering or join one, your presence makes our community richer. Start your journey today and discover the joy of meaningful connections.
            </Text>
            <div className={styles.ctaButtons}>
              <Suspense fallback={<Loading variant="pulse" size="sm" />}>
                <CTAContent />
              </Suspense>
              <Button variant="secondary" onClick={() => document.getElementById("mission")?.scrollIntoView({ behavior: "smooth" })}>
                Learn More
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

