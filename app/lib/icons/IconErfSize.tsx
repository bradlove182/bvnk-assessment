import type { IconProps } from "."

export default function IconErfSize({ size = "20", ...rest }: IconProps) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="currentColor" viewBox="0 0 24 24" {...rest}>
            <path d="m3.5 2.151 1.924 1.925a.6.6 0 0 1-.848.848L4.1 4.448V19.5c0 .22.18.4.4.4h15.052l-.476-.476a.6.6 0 0 1 .848-.848L21.85 20.5l-1.925 1.924a.6.6 0 0 1-.848-.848l.476-.476H4.5a1.6 1.6 0 0 1-1.6-1.6V4.448l-.476.476a.6.6 0 0 1-.848-.848L3.5 2.15Zm6 .749a.6.6 0 0 0 0 1.2h4a.6.6 0 1 0 0-1.2h-4Zm8 0a.6.6 0 1 0 0 1.2h2a.4.4 0 0 1 .4.4v2a.6.6 0 1 0 1.2 0v-2a1.6 1.6 0 0 0-1.6-1.6h-2Zm3.6 7.6a.6.6 0 1 0-1.2 0v4a.6.6 0 1 0 1.2 0v-4Z" />
        </svg>
    )
}
