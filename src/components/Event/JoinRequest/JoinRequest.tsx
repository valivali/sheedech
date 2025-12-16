import { Button } from "@/components/UI/Button"
import { Input } from "@/components/UI/Input"
import { Textarea } from "@/components/UI/Textarea"
import { Text, Title } from "@/components/UI/Text"
import React, { useState } from "react"
import { JoinRequestFormData } from "../EventDetail/EventDetail.types"
import styles from "./JoinRequest.module.scss"

interface JoinRequestProps {
    maxGuests: number
}

export const JoinRequest = ({ maxGuests }: JoinRequestProps) => {
    const [formData, setFormData] = useState<JoinRequestFormData>({
        numberOfGuests: 1,
        bringingItem: "",
        comments: ""
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log("Join request submitted:", formData)
        alert("Request to join submitted! (Mock action)")
    }

    return (
        <div className={styles.requestSection}>
            <Title level={2} size="lg" className={styles.requestTitle}>Request to Join</Title>
            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.formField}>
                    <label className={styles.fieldLabel}>
                        <Text className={styles.labelText}>Number of Guests</Text> <span className={styles.required}>*</span>
                    </label>
                    <Input
                        type="number"
                        min="1"
                        max={maxGuests}
                        value={formData.numberOfGuests}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                numberOfGuests: parseInt(e.target.value) || 1
                            })
                        }
                        required
                    />
                </div>

                <div className={styles.formField}>
                    <label className={styles.fieldLabel}>
                        <Text className={styles.labelText}>What are you planning to bring?</Text> <Text size="sm" className={styles.optional}>(Optional)</Text>
                    </label>
                    <Input
                        type="text"
                        placeholder="e.g., Wine, Dessert, Side dish..."
                        value={formData.bringingItem}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                bringingItem: e.target.value
                            })
                        }
                    />
                </div>

                <div className={styles.formField}>
                    <label className={styles.fieldLabel}>
                        <Text className={styles.labelText}>Additional Questions or Comments</Text> <Text size="sm" className={styles.optional}>(Optional)</Text>
                    </label>
                    <Textarea
                        placeholder="Any dietary restrictions, questions, or special requests..."
                        rows={4}
                        value={formData.comments}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                comments: e.target.value
                            })
                        }
                    />
                </div>

                <Button type="submit" variant="primary" size="lg" className={styles.submitButton}>
                    Submit Request
                </Button>
            </form>
        </div>
    )
}
