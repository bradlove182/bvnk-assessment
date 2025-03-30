import type { RouteConfig } from "@react-router/dev/routes"
import { index, route } from "@react-router/dev/routes"

export default [
    index("routes/index.tsx"),
    route("/payin/:uuid", "routes/index.tsx", [
        route("/pay", "routes/index.tsx"),
        route("/expired", "routes/index.tsx"),
    ]),
] satisfies RouteConfig
