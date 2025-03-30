import type { Route } from "./+types"

export async function loader({ params }: Route.LoaderArgs) {
    if (!params.uuid) {
        return new Response("Invalid Quote ID", { status: 400 })
    }
}
