import { Card, CardContent, CardHeader, CardTitle } from "@lib/components/ui/card"
import { CircleAlertIcon } from "lucide-react"

export function meta() {
    return [
        { title: "BVNK | Expired Quote" },
        { name: "description", content: "Welcome to BVNK" },
    ]
}

export default function Index() {
    return (
        <Card className="w-76 lg:w-92 text-center p-10">
            <CardHeader>
                <CardTitle className="flex flex-col gap-2 items-center justify-center">
                    <CircleAlertIcon role="presentation" className="size-12 text-destructive" />
                    <span className="text-xl font-bold">
                        Payment details expired
                    </span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">
                    The payment details for your transaction have expired.
                </p>
            </CardContent>
        </Card>
    )
}
