import { useState } from "react"

import { AddressInputWithSuggestions } from "@/components/Onboarding/Steps/PersonalInfo/AddressInputWithSuggestions"
import { Button } from "@/components/UI/Button"
import { DateRange, DateRangePicker } from "@/components/UI/DateRangePicker"
import { AddressSuggestion } from "@/hooks"

import styles from "./SearchSection.module.scss"

export function SearchSection() {
    const [addressValue, setAddressValue] = useState("")
    const [selectedAddress, setSelectedAddress] = useState<AddressSuggestion | null>(null)
    const [dateRange, setDateRange] = useState<DateRange>({ startDate: null, endDate: null })

    const handleSearch = async () => {
        if (!selectedAddress?.geometry?.coordinates) {
            console.log("No valid address selected for search")
            return
        }

        const [lon, lat] = selectedAddress.geometry.coordinates
        // 20km radius approx
        const latDelta = 0.18
        const lonDelta = 0.18 / Math.cos(lat * (Math.PI / 180))

        const params = new URLSearchParams({
            minLat: (lat - latDelta).toString(),
            maxLat: (lat + latDelta).toString(),
            minLon: (lon - lonDelta).toString(),
            maxLon: (lon + lonDelta).toString()
        })

        if (dateRange.startDate) params.append("startDate", dateRange.startDate.toISOString())
        if (dateRange.endDate) params.append("endDate", dateRange.endDate.toISOString())

        try {
            const res = await fetch(`/api/events?${params.toString()}`)
            const result = await res.json()
            console.log("Search Results:", result)
        } catch (error) {
            console.error("Search error:", error)
        }
    }

    return (
        <div className={styles.inputsRow}>
            <div className={styles.searchInputGroup}>
                <AddressInputWithSuggestions
                    label="Location"
                    placeholder="Search in a certain area"
                    value={addressValue}
                    onChange={setAddressValue}
                    onSuggestionSelect={setSelectedAddress}
                    helperText={""}
                />
            </div>
            <div className={`${styles.searchInputGroup} ${styles.dateRangePickerContainer}`}>
                <label className={styles.label}>Dates</label>
                <DateRangePicker value={dateRange} onChange={setDateRange} minDate={new Date()} />
            </div>
            <Button variant="primary" onClick={handleSearch}>
                Search
            </Button>
        </div>
    )
}
