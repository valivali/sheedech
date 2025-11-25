import styles from "./CheckboxGroup.module.scss"
import { CheckboxGroupProps, CheckboxItemProps, ControlledCheckboxGroupProps } from "./CheckboxGroup.types"

export const CheckboxItem = ({ children, error, className, ...props }: CheckboxItemProps) => {
  const classes = [styles.checkboxItem, className].filter(Boolean).join(" ")

  return (
    <label className={classes}>
      <input type="checkbox" className={styles.checkbox} {...props} />
      <span className={styles.checkboxMark}></span>
      <span className={styles.checkboxLabel}>{children}</span>
      {error && <span className={styles.checkboxError}>{error}</span>}
    </label>
  )
}

export const CheckboxGroup = ({ children, label, error, className, labelClassName }: CheckboxGroupProps) => {
  const classes = [styles.checkboxGroup, className].filter(Boolean).join(" ")
  const labelClasses = [styles.checkboxGroupLabel, labelClassName].filter(Boolean).join(" ")

  return (
    <div className={classes}>
      {label && <div className={labelClasses}>{label}</div>}
      <div className={styles.checkboxGroupItems}>{children}</div>
      {error && <span className={styles.checkboxGroupError}>{error}</span>}
    </div>
  )
}

export const ControlledCheckboxGroup = ({
  options,
  value,
  onChange,
  label,
  error,
  className,
  labelClassName
}: ControlledCheckboxGroupProps) => {
  const handleCheckboxChange = (optionValue: string) => {
    const valueSet = new Set(value)
    if (valueSet.has(optionValue)) {
      valueSet.delete(optionValue)
    } else {
      valueSet.add(optionValue)
    }
    onChange(Array.from(valueSet))
  }

  return (
    <CheckboxGroup label={label} error={error} className={className} labelClassName={labelClassName}>
      {options.map((option) => (
        <CheckboxItem key={option.value} checked={value.includes(option.value)} onChange={() => handleCheckboxChange(option.value)}>
          {option.label}
        </CheckboxItem>
      ))}
    </CheckboxGroup>
  )
}
