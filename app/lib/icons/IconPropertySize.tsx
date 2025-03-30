import type { IconProps } from "."

export default function IconPropertySize({ size = "20", ...rest }: IconProps) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="currentColor" viewBox="0 0 24 24" {...rest}>
            <path d="m3.5 2.151 1.924 1.925a.6.6 0 1 1-.848.848L4.1 4.448V19.5c0 .22.18.4.4.4h15.052l-.476-.476a.6.6 0 0 1 .848-.848L21.85 20.5l-1.925 1.924a.6.6 0 0 1-.848-.848l.476-.476H4.5a1.6 1.6 0 0 1-1.6-1.6V4.448l-.476.476a.6.6 0 0 1-.848-.848L3.5 2.15Z" />
            <path fillRule="evenodd" d="M7.147 9.115a.598.598 0 0 0-.239.385H6.9V16A1.1 1.1 0 0 0 8 17.1h10a1.1 1.1 0 0 0 1.1-1.1V9.5h-.008a.598.598 0 0 0-.24-.385l-5.205-3.786a1.1 1.1 0 0 0-1.294 0L7.147 9.115ZM13 6.342l4.9 3.563V15.9H8.1V9.905L13 6.342Z" clipRule="evenodd" />
        </svg>
    )
}
