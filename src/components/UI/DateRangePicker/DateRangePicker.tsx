import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isBefore,
  isSameDay,
  isSameMonth,
  isWithinInterval,
  startOfMonth,
  startOfWeek,
  subMonths
} from "date-fns"
import { useEffect, useRef, useState } from "react"

import styles from "./DateRangePicker.module.scss"
import { DateRangePickerProps } from "./DateRangePicker.types"

export function DateRangePicker({ value, onChange, minDate, className }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleDateClick = (date: Date) => {
    if (minDate && isBefore(date, minDate) && !isSameDay(date, minDate)) return

    if (!value.startDate || (value.startDate && value.endDate)) {
      onChange({ startDate: date, endDate: null })
    } else {
      if (isBefore(date, value.startDate)) {
        onChange({ startDate: date, endDate: value.startDate })
      } else {
        onChange({ ...value, endDate: date })
        setIsOpen(false)
      }
    }
  }

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1))

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const calendarStart = startOfWeek(monthStart)
  const calendarEnd = endOfWeek(monthEnd)

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd })
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const formatDateRange = () => {
    if (!value.startDate) return "Select dates"
    if (!value.endDate) return format(value.startDate, "MMM d, yyyy")
    return `${format(value.startDate, "MMM d")} - ${format(value.endDate, "MMM d, yyyy")}`
  }

  return (
    <div className={`${styles.container} ${className || ""}`} ref={containerRef}>
      <div className={`${styles.trigger} ${isOpen ? styles.open : ""}`} onClick={() => setIsOpen(!isOpen)}>
        <span className={value.startDate ? styles.value : styles.placeholder}>{formatDateRange()}</span>
        <svg className={styles.icon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>

      {isOpen && (
        <div className={styles.dropdown}>
          <div className={styles.header}>
            <button className={styles.navButton} onClick={prevMonth} type="button">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span className={styles.monthTitle}>{format(currentMonth, "MMMM yyyy")}</span>
            <button className={styles.navButton} onClick={nextMonth} type="button">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className={styles.grid}>
            {weekDays.map((d) => (
              <div key={d} className={styles.dayLabel}>
                {d}
              </div>
            ))}
            {days.map((day, idx) => {
              const isSelected = (value.startDate && isSameDay(day, value.startDate)) || (value.endDate && isSameDay(day, value.endDate))
              const isInRange = value.startDate && value.endDate && isWithinInterval(day, { start: value.startDate, end: value.endDate })
              const isDisabled = minDate && isBefore(day, minDate) && !isSameDay(day, minDate)
              const isToday = isSameDay(day, new Date())
              const isCurrentMonth = isSameMonth(day, currentMonth)

              return (
                <div
                  key={idx}
                  className={`
                    ${styles.day}
                    ${!isCurrentMonth ? styles.otherMonth : ""}
                    ${isSelected ? styles.selected : ""}
                    ${isInRange && !isSelected ? styles.inRange : ""}
                    ${value.startDate && isSameDay(day, value.startDate) && value.endDate ? styles.rangeStart : ""}
                    ${value.endDate && isSameDay(day, value.endDate) ? styles.rangeEnd : ""}
                    ${isDisabled ? styles.disabled : ""}
                    ${isToday ? styles.today : ""}
                  `}
                  onClick={() => !isDisabled && handleDateClick(day)}
                >
                  {format(day, "d")}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
