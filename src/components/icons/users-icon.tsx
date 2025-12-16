import { IconProps } from "./types"

export const UsersIcon = ({ size = 24, color = "currentColor", ...props }: IconProps) => {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
            <path
                d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}
