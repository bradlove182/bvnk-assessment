import { getQuote, isRequestError, type Quote, type RequestError } from "@lib/data"
import type { Route } from "./+types/quote"

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

export default function Index({ loaderData }: Route.ComponentProps) {
    return (
        <h1>
            payin:
            { loaderData.quote.data?.merchantDisplayName }
        </h1>
    )
}
