import type { Quote, RequestResponse } from "@lib/data"
import type { Route } from "./+types/quote"
import { Button } from "@lib/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@lib/components/ui/card"
import { Label } from "@lib/components/ui/label"
import { Loader } from "@lib/components/ui/loader"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@lib/components/ui/select"
import { getQuote, payQuote, updateQuote } from "@lib/data"
import { useCountdown } from "@lib/hooks/countdown"
import { useCallback } from "react"
import { redirect, useFetcher } from "react-router"

export function meta() {
    return [
        { title: "BVNK | Accept Quote" },
        { name: "description", content: "Welcome to BVNK" },
    ]
}

export async function loader({ params }: Route.LoaderArgs) {
    const quote = await getQuote(params.uuid)

    if (quote.data && quote.data.status === "EXPIRED") {
        return redirect(`/payin/${params.uuid}/expired`)
    }

    if (quote.data && quote.data.quoteStatus === "ACCEPTED") {
        return redirect(`/payin/${params.uuid}/pay`)
    }

    return { quote }
}

export async function action({
    request,
    params,
}: Route.ActionArgs) {
    const { uuid } = params

    const formData = await request.formData()

    const currency = formData.get("currency")
    const accepted = formData.get("accepted")

    if (currency && typeof currency === "string") {
        const quote = await updateQuote({ uuid, currency, payInMethod: "crypto" })

        if (quote.data && quote.data.status === "EXPIRED") {
            return redirect(`/payin/${params.uuid}/expired`)
        }

        if (quote.data && quote.data.quoteStatus === "ACCEPTED") {
            return redirect(`/payin/${params.uuid}/pay`)
        }

        return quote
    }

    if (accepted && accepted === "true") {
        const quote = await payQuote(uuid)

        if (quote.data && quote.data.status === "EXPIRED") {
            return redirect(`/payin/${params.uuid}/expired`)
        }

        if (quote.data && quote.data.quoteStatus === "ACCEPTED") {
            return redirect(`/payin/${params.uuid}/pay`)
        }

        return quote
    }
}

export default function Index({ loaderData }: Route.ComponentProps) {
    const fetcher = useFetcher<RequestResponse<Quote>>()

    const quote: RequestResponse<Quote> = fetcher.data || loaderData.quote

    const loading = fetcher.state !== "idle"

    const handleOnSelectCurrency = useCallback((currency: string) => {
        fetcher.submit({ currency }, { method: "POST" })
    }, [fetcher])

    const { hours, minutes, seconds } = useCountdown(
        quote.data?.acceptanceExpiryDate,
        () => {
            if (quote.data?.paidCurrency.currency) {
                handleOnSelectCurrency(quote.data.paidCurrency.currency)
            }
        },
    )

    const handleOnClickConfirm = useCallback(() => {
        if (quote.data?.paidCurrency.currency) {
            fetcher.submit({ accepted: true }, { method: "POST" })
        }
    }, [fetcher, quote.data?.paidCurrency.currency])

    const currencyOptions = [
        {
            label: "Bitcoin",
            value: "BTC",
        },
        {
            label: "Ethereum",
            value: "ETH",
        },
        {
            label: "Litecoin",
            value: "LTC",
        },
    ] as const

    if (quote.error) {
        return (
            <Card className="w-76 lg:w-92 text-center">
                <CardHeader>
                    <CardTitle>{quote.error.message}</CardTitle>
                    <CardDescription>
                        {`Request ID: ${quote.error.requestId}`}
                    </CardDescription>
                </CardHeader>
            </Card>
        )
    }

    return (
        <Card className="w-76 lg:w-92 text-center">
            <CardHeader>
                <CardTitle>
                    <h3 className="font-medium text-xl">
                        {quote.data.merchantDisplayName}
                    </h3>
                    <div className="font-semibold flex gap-2 justify-center">
                        <span className="text-[32px] leading-[40px]">
                            {quote.data.displayCurrency.amount}
                        </span>
                        <sub className="text-xl self-end leading-[40px]">
                            {quote.data.displayCurrency.currency}
                        </sub>
                    </div>
                </CardTitle>
                <CardDescription>
                    <span>
                        {"For reference number: "}
                    </span>
                    <span className="text-foreground font-medium">
                        {quote.data.reference}
                    </span>
                </CardDescription>
            </CardHeader>
            <CardContent>
                <fetcher.Form method="POST">
                    <fieldset className="space-y-1">
                        <Label htmlFor="currency">Pay with</Label>
                        <Select name="currency" defaultValue={quote.data.paidCurrency.currency ?? undefined} onValueChange={handleOnSelectCurrency}>
                            <SelectTrigger id="currency" className="w-full">
                                <SelectValue placeholder="Select Currency" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {currencyOptions.map(item => (
                                        <SelectItem
                                            key={item.value}
                                            value={item.value}
                                        >
                                            {item.label}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </fieldset>
                </fetcher.Form>
                {quote.data.quoteExpiryDate
                    ? (
                            <div className="divide-y divide-border">
                                <div className="flex justify-between items-center">
                                    <span>Amount due</span>
                                    <span>
                                        {
                                            loading
                                                ? <Loader />
                                                : `${quote.data.displayCurrency.amount} ${quote.data.displayCurrency.currency}`
                                        }
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>
                                        Quoted price expires in
                                    </span>
                                    <span>
                                        {
                                            loading
                                                ? <Loader />
                                                : `${hours}:${minutes}:${seconds}`
                                        }
                                    </span>
                                </div>
                            </div>
                        )
                    : undefined}
            </CardContent>
            <CardFooter>
                {quote.data.quoteExpiryDate
                    ? (
                            <Button className="w-full" onClick={handleOnClickConfirm}>
                                Confirm
                            </Button>
                        )
                    : null}
            </CardFooter>
        </Card>
    )
}
