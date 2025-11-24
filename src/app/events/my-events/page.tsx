"use client"

import { Suspense } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { Title, Text } from "@/components/UI/Text"
import { Button } from "@/components/UI/Button"
import { Loading } from "@/components/UI/Loading"
import { EventCardGrid } from "@/components/EventCard"
import { useUserEvents } from "@/api/frontend/events"
import styles from "./page.module.scss"

const motivationalQuotes = {
  hosting: [
    "Every great gathering starts with a single invitation.",
    "Your home is where memories are made. Share it with others.",
    "The best way to find yourself is to lose yourself in the service of others."
  ],
  attending: [
    "New experiences await around every corner.",
    "The best stories come from unexpected connections.",
    "Step out of your comfort zone and into a new community."
  ],
  historical: [
    "The memories we create together last a lifetime.",
    "Every gathering leaves a mark on our hearts.",
    "Yesterday's events shape tomorrow's friendships."
  ]
}

function getRandomQuote(category: keyof typeof motivationalQuotes): string {
  const quotes = motivationalQuotes[category]
  return quotes[Math.floor(Math.random() * quotes.length)]
}

function MyEventsContent() {
  const router = useRouter()
  const { data, isLoading, error } = useUserEvents()

  if (isLoading) {
    return <Loading variant="spinner" size="lg" text="Loading your events..." />
  }

  if (error) {
    return (
      <div className={styles.error}>
        <Text>Failed to load events. Please try again later.</Text>
      </div>
    )
  }

  const { hosting = [], attending = [], historical = [] } = data || {}

  return (
    <>
      <div className={styles.header}>
        <Title level={1}>My Events</Title>
        <Text className={styles.subtitle}>
          Manage your hosting, attending, and past events
        </Text>
      </div>

      <div className={styles.sections}>
        <section className={styles.section}>
          <Title level={2} className={styles.sectionTitle}>
            Hosting Events
          </Title>
          {hosting.length > 0 ? (
            <EventCardGrid events={hosting} />
          ) : (
            <div className={styles.emptyState}>
              <Text className={styles.quote}>
                "{getRandomQuote("hosting")}"
              </Text>
              <Button
                variant="primary"
                onClick={() => router.push("/events/create")}
                className={styles.actionButton}
              >
                Create New Event
              </Button>
            </div>
          )}
        </section>

        <section className={styles.section}>
          <Title level={2} className={styles.sectionTitle}>
            Attending Events
          </Title>
          {attending.length > 0 ? (
            <EventCardGrid events={attending} />
          ) : (
            <div className={styles.emptyState}>
              <Text className={styles.quote}>
                "{getRandomQuote("attending")}"
              </Text>
              <Button
                variant="primary"
                onClick={() => router.push("/")}
                className={styles.actionButton}
              >
                Search Events
              </Button>
            </div>
          )}
        </section>

        <section className={styles.section}>
          <Title level={2} className={styles.sectionTitle}>
            Historical Events
          </Title>
          {historical.length > 0 ? (
            <EventCardGrid events={historical} />
          ) : (
            <div className={styles.emptyState}>
              <Text className={styles.quote}>
                "{getRandomQuote("historical")}"
              </Text>
            </div>
          )}
        </section>
      </div>
    </>
  )
}

export default function MyEventsPage() {
  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
        <div className={styles.container}>
          <Suspense fallback={<Loading variant="spinner" size="lg" text="Loading your events..." />}>
            <MyEventsContent />
          </Suspense>
        </div>
      </main>
      <Footer />
    </div>
  )
}

