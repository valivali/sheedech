import { IconProps } from "./types"

export const CalendarIcon = ({ size = 24, color = "currentColor", ...props }: IconProps) => {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
            <path
                d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}
