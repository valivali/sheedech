import { IconProps } from "./types"

export const MapPinIcon = ({ size = 24, color = "currentColor", ...props }: IconProps) => {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
            <path
                d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <circle cx="12" cy="9" r="2.5" stroke={color} strokeWidth="2" />
        </svg>
    )
}
