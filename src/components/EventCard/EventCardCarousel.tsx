"use client"

import { useRef, useState, useEffect } from "react"
import { EventCardData } from "@/types/event"
import { EventCard } from "./EventCard"
import styles from "./EventCardCarousel.module.scss"

export interface EventCardCarouselProps {
  events: EventCardData[]
  className?: string
}

export const EventCardCarousel = ({ events, className }: EventCardCarouselProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkScrollability = () => {
    if (!scrollContainerRef.current) return

    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
    setCanScrollLeft(scrollLeft > 0)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
  }

  useEffect(() => {
    checkScrollability()
    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener("scroll", checkScrollability)
      window.addEventListener("resize", checkScrollability)
      return () => {
        container.removeEventListener("scroll", checkScrollability)
        window.removeEventListener("resize", checkScrollability)
      }
    }
  }, [events])

  const scroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return

    const container = scrollContainerRef.current
    const firstCard = container.querySelector(`[data-card-id]`) as HTMLElement
    const cardWidth = firstCard?.offsetWidth || 300
    const gap = 24
    const scrollAmount = cardWidth + gap

    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth"
    })
  }

  if (events.length === 0) {
    return null
  }

  return (
    <div className={`${styles.carousel} ${className || ""}`}>
      {canScrollLeft && (
        <button
          className={`${styles.navButton} ${styles.navButtonLeft}`}
          onClick={() => scroll("left")}
          aria-label="Scroll left"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}
      <div className={styles.scrollContainer} ref={scrollContainerRef}>
        <div className={styles.cardsWrapper}>
          {events.map((event) => (
            <div key={event.id} className={styles.cardWrapper} data-card-id={event.id}>
              <EventCard event={event} />
            </div>
          ))}
        </div>
      </div>
      {canScrollRight && (
        <button
          className={`${styles.navButton} ${styles.navButtonRight}`}
          onClick={() => scroll("right")}
          aria-label="Scroll right"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}
    </div>
  )
}

