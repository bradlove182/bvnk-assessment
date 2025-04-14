import { cn } from "@lib/utils"
import * as React from "react"
import { Button } from "./button"

interface CopyableValueProps extends React.HTMLAttributes<HTMLDivElement> {
    value: string
    className?: string
    suffix?: string
    maxLength?: number
}

/**
 * Truncates a string in the middle, adding an ellipsis.
 */
function truncateMiddle(str: string, maxLength: number = 20): string {
    if (str.length <= maxLength)
        return str

    const ellipsis = "..."
    const charsToShow = maxLength - ellipsis.length
    const frontChars = Math.ceil(charsToShow / 2)
    const backChars = Math.floor(charsToShow / 2)

    return str.substring(0, frontChars) + ellipsis + str.substring(str.length - backChars)
}

export function CopyableValue({
    value,
    className,
    maxLength = 20,
    suffix,
    ...props
}: CopyableValueProps) {
    const [copied, setCopied] = React.useState(false)

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(value)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
        catch (err) {
            console.error("Failed to copy text: ", err)
        }
    }

    const displayText = value
    const truncatedText = truncateMiddle(displayText, maxLength)

    return (
        <div
            className={cn(
                "flex items-center gap-2 w-fit",
                className,
            )}
            {...props}
        >
            <div title={displayText} className="font-medium">{truncatedText}</div>
            {suffix && <span>{suffix}</span>}
            <Button
                variant="ghost"
                size="sm"
                onClick={copyToClipboard}
                className="text-primary shrink-0 px-0 py-0 hover:bg-transparent cursor-pointer h-fit"
            >
                {copied
                    ? <span>Copied!</span>
                    : <span>Copy</span>}
            </Button>
        </div>
    )
}
