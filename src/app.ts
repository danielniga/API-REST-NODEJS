import fastify from "fastify"
import { transctionsRoutes } from "./routes/transactions"
import cookie from "@fastify/cookie"

export const app = fastify()

app.register(cookie)
app.register(transctionsRoutes, { prefix: "/transactions" })