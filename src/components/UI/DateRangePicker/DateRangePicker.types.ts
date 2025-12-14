export interface DateRange {
    startDate: Date | null;
    endDate: Date | null;
}

export interface DateRangePickerProps {
    value: DateRange;
    onChange: (range: DateRange) => void;
    minDate?: Date;
    className?: string;
}
