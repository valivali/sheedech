import { Suspense } from "react"

import { EventDetail } from "@/components/Event/EventDetail"
import { Footer } from "@/components/Footer"
import { Header } from "@/components/Header"
import { Loading } from "@/components/UI/Loading"

import styles from "./page.module.scss"

interface EventPageProps {
  params: Promise<{ id: string }>
}

export default async function EventPage({ params }: EventPageProps) {
  const { id } = await params

  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
        <div className={styles.container}>
          <Suspense fallback={<Loading variant="spinner" size="lg" text="Loading event details..." />}>
            <EventDetail eventId={id} />
          </Suspense>
        </div>
      </main>
      <Footer />
    </div>
  )
}
