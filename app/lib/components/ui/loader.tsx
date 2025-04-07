import { cn } from "@lib/utils"
import { Loader as LoaderIcon } from "lucide-react"

export function Loader({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            className={cn(
                "flex items-center justify-center animate-spin h-4 w-4",
                className,
            )}
            {...props}
        >
            <LoaderIcon />
        </div>
    )
}
