import type { Quote, RequestResponse } from "@lib/data"
import type { Route } from "./+types/quote"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@lib/components/ui/card"
import { Label } from "@lib/components/ui/label"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@lib/components/ui/select"
import { getQuote, updateQuote } from "@lib/data"
import { useCallback } from "react"
import { useFetcher, useLoaderData } from "react-router"

export function meta() {
    return [
        { title: "BVNK | Accept Quote" },
        { name: "description", content: "Welcome to BVNK" },
    ]
}

export async function loader({ params }: Route.LoaderArgs) {
    const quote = await getQuote(params.uuid)

    return { quote }
}

export async function action({
    request,
    params,
}: Route.ActionArgs) {
    const { uuid } = params

    const formData = await request.formData()

    const currency = formData.get("currency")

    if (currency && typeof currency === "string") {
        const response = await updateQuote({ uuid, currency, payInMethod: "crypto" })
        console.log(response)
        return response
    }
}

export default function Index({ loaderData }: Route.ComponentProps) {
    const fetcher = useFetcher<RequestResponse<Quote>>()

    const quote: RequestResponse<Quote> = fetcher.data || loaderData.quote

    const handleOnSelectCurrency = useCallback((currency: string) => {
        fetcher.submit({ currency }, { method: "POST" })
    }, [fetcher])

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
            <div>
                <p>{quote.error.message}</p>
                <p>
                    Request ID:
                    {quote.error.requestId}
                </p>
            </div>
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
                        <Select name="currency" onValueChange={handleOnSelectCurrency}>
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
            </CardContent>
        </Card>
    )
}
