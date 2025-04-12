import type { Quote, RequestResponse } from "@lib/data"
import type { Route } from "./+types/quote-pay"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@lib/components/ui/card"
import { CopyableValue } from "@lib/components/ui/copyable-value"
import { getQuote } from "@lib/data"
import { useCountdown } from "@lib/hooks/countdown"
import { QRCodeSVG } from "qrcode.react"
import { redirect, useFetcher } from "react-router"

export function meta() {
    return [
        { title: "BVNK | Pay Quote" },
        { name: "description", content: "Welcome to BVNK" },
    ]
}

function getCryptoCurrencyName(currency: string) {
    switch (currency) {
        case "BTC":
            return "Bitcoin"
        case "ETH":
            return "Ethereum"
        case "XRP":
            return "XRP"
        case "LTC":
            return "Litecoin"
        default:
            return currency
    }
}

export async function loader({ params }: Route.LoaderArgs) {
    const quote = await getQuote(params.uuid)

    if (quote.data && quote.data.status === "EXPIRED") {
        return redirect(`/payin/${params.uuid}/expired`)
    }

    return { quote }
}

export async function action({
    params,
}: Route.ActionArgs) {
    const { uuid } = params

    const quote = await getQuote(uuid)

    if (quote.data && quote.data.status === "EXPIRED") {
        return redirect(`/payin/${params.uuid}/expired`)
    }

    return quote
}

export default function Index({ loaderData }: Route.ComponentProps) {
    const fetcher = useFetcher<RequestResponse<Quote>>()

    const quote: RequestResponse<Quote> = fetcher.data || loaderData.quote

    const { hours, minutes, seconds } = useCountdown(quote.data?.expiryDate, () => {
        fetcher.submit(null, { method: "POST" })
    })

    return (
        <Card className="w-76 lg:w-92">
            <CardHeader>
                <CardTitle className="text-center text-xl font-medium">
                    {`Pay with ${getCryptoCurrencyName(quote.data?.paidCurrency.currency ?? "")}`}
                </CardTitle>
                <CardDescription className="text-center">
                    {`To complete this payment send the amount due to the ${quote.data?.paidCurrency.currency} address provided below.`}
                </CardDescription>
            </CardHeader>
            <CardContent className="divide-y divide-border">
                <div className="flex justify-between items-center">
                    <span>Amount due</span>
                    <CopyableValue
                        maxLength={12}
                        value={quote.data?.paidCurrency.amount?.toString() ?? ""}
                        suffix={` ${quote.data?.paidCurrency.currency}`}
                    />
                </div>
                <div className="flex flex-col items-center justify-center gap-4">
                    <div className="flex justify-between items-center w-full">
                        <span>
                            {`${quote.data?.paidCurrency.currency} Address`}
                        </span>
                        <CopyableValue maxLength={12} value={quote.data?.address?.address ?? ""} />
                    </div>
                    <QRCodeSVG value={quote.data?.address?.uri ?? ""} />
                    <span className="text-xs text-muted-foreground">
                        {quote.data?.address?.address}
                    </span>
                </div>
                <div className="flex justify-between items-center">
                    <span>
                        Time left to pay
                    </span>
                    <span>
                        {`${hours}:${minutes}:${seconds}`}
                    </span>
                </div>
            </CardContent>
        </Card>
    )
}
