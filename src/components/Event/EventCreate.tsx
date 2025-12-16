"use client"

import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useCallback } from "react"

import { EventForm } from "@/components/Event/EventForm/EventForm"
import { Loading } from "@/components/UI/Loading"
import { Text, Title } from "@/components/UI/Text"
import { useUser } from "@/lib/auth"
import { EventStatus } from "@/types/event"
import { CreateEventFormData } from "@/validations/event"

import styles from "./EventCreate.module.scss"

export function EventCreate() {
  const { isLoaded } = useUser()
  const router = useRouter()

  const createEventMutation = useMutation({
    mutationFn: async (payload: CreateEventFormData & { status: EventStatus }) => {
      const response = await fetch("/api/events/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || "Failed to create event")
      }

      return result
    },
    onSuccess: () => {
      router.push("/dashboard")
    },
    onError: (error) => {
      console.error("Error creating event:", error)
    }
  })

  const onSubmit = useCallback(
    async (data: CreateEventFormData, eventStatus: EventStatus) => {
      createEventMutation.mutate({ ...data, status: eventStatus })
    },
    [createEventMutation]
  )

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Title level={1}>Host an Event</Title>
        <Text>Share your table, share your culture</Text>
      </div>

      {!isLoaded ? (
        <Loading variant="spinner" size="lg" text="Loading..." />
      ) : (
        <EventForm onSubmit={onSubmit} isSubmitting={createEventMutation.isPending} />
      )}
    </div>
  )
}
