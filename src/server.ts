import { app } from "./app"
//import "dotenv/config"
import { env } from "./env"
/*import "dotenv/config"
import fastify from "fastify"
import { knex } from "./database"
import crypto from "node:crypto"
import { env } from "./env"
import { transctionsRoutes } from "./routes/transactions"
import cookie from "@fastify/cookie"

const app = fastify()

app.register(cookie)
app.register(transctionsRoutes, { prefix: "/transactions" })*/
app.listen({
  host: "0.0.0.0",
  port: env.PORT
}).then(() => {
    console.log("Server is listening on port 3333")
  })