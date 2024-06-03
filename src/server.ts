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
const port = env.PORT || 4000;
app.listen({port}).then(() => {
    console.log("Server is listening on port 3333")
  })