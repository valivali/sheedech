import { useRouter } from "next/navigation"
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

    const router = useRouter()

    const handleSearch = () => {
        if (!selectedAddress?.geometry?.coordinates) {
            console.log("No valid address selected for search")
            return
        }

        const [lon, lat] = selectedAddress.geometry.coordinates

        const params = new URLSearchParams({
            lat: lat.toString(),
            lon: lon.toString()
        })

        if (dateRange.startDate) params.append("startDate", dateRange.startDate.toISOString())
        if (dateRange.endDate) params.append("endDate", dateRange.endDate.toISOString())

        router.push(`/event-mapper?${params.toString()}`)
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
