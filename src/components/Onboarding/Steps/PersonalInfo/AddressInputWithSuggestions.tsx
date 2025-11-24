import { Input } from "@/components/UI/Input"
import { useAddressAutocomplete } from "@/hooks"

import styles from "./PersonalInfoStep.module.scss"

interface AddressInputWithSuggestionsProps {
  value?: string
  onChange: (value: string) => void
  error?: string
  placeholder?: string
  label?: string
  helperText?: string
  className?: string
}

export const AddressInputWithSuggestions = ({
  value = "",
  onChange,
  error,
  placeholder = "123 Main St, City, State",
  label = "Address *",
  helperText = "We will show estimated address to users until there is a match",
  className
}: AddressInputWithSuggestionsProps) => {
  const {
    suggestions: addressSuggestions,
    showSuggestions,
    isLoadingSuggestions,
    handleAddressChange,
    handleSuggestionSelect,
    handleAddressFocus,
    handleAddressBlur
  } = useAddressAutocomplete({
    setValue: (field, val) => onChange(val),
    fieldName: "address"
  })

  return (
    <div className={`${styles.addressContainer} ${className || ''}`}>
      <Input
        label={label}
        value={value}
        error={error}
        helperText={helperText}
        placeholder={placeholder}
        onChange={(e) => {
          onChange(e.target.value)
          handleAddressChange(e.target.value)
        }}
        onFocus={handleAddressFocus}
        onBlur={handleAddressBlur}
      />
      {showSuggestions && addressSuggestions.length > 0 && (
        <div className={styles.suggestionsDropdown}>
          {addressSuggestions.map((suggestion, index) => (
            <div key={index} className={styles.suggestionItem} onClick={() => handleSuggestionSelect(suggestion)}>
              {suggestion.properties?.formatted || "Unknown location"}
            </div>
          ))}
        </div>
      )}
      {isLoadingSuggestions && <div className={styles.loadingSuggestions}>Loading suggestions...</div>}
    </div>
  )
}
