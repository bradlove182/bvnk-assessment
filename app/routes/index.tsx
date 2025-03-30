import type { Route } from "./+types"

export function meta() {
    return [
        { title: "BVNK" },
        { name: "description", content: "Welcome to BVNK" },
    ]
}

export default function Index() {
    return (
        <h1>Home</h1>
    )
}
