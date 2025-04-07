import type { RouteConfig } from "@react-router/dev/routes"
import { index, route } from "@react-router/dev/routes"

export default [
    index("routes/index.tsx"),
    route("payin", "routes/payin/index.tsx", [
        route(":uuid", "routes/payin/quote.tsx"),
        route(":uuid/pay", "routes/payin/pay-quote.tsx"),
        route(":uuid/expired", "routes/payin/expired-quote.tsx"),
    ]),
] satisfies RouteConfig
