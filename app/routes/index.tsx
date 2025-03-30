import { redirect } from "react-router"

export function meta() {
    return [
        { title: "BVNK" },
        { name: "description", content: "Welcome to BVNK" },
    ]
}

export async function loader() {
    return redirect("/payin", 302)
}

export default function Index() {}
