import { IconProps } from "./types"

export const OccasionIcon = ({ size = 24, color = "currentColor", ...props }: IconProps) => {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
            <path
                d="M12 2l2.4 6h6.6l-5 4 1.5 6-5.5-3.5-5.5 3.5 1.5-6-5-4h6.6z"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                transform="scale(0.6) translate(8, 2)"
            />
            <path
                d="M6 15c0 3 2.5 5 6 5s6-2 6-5"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}
