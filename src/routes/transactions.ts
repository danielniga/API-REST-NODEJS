import { FastifyInstance } from "fastify"
import { z } from "zod"
import { knex } from "../database"
import { randomUUID } from "node:crypto"
import { checkSessionIdExist } from "../middlewares/check-session-id-exist"
import { request } from "node:http"

export const transctionsRoutes = async (app: FastifyInstance) => {
/*
    app.addHook("preHandler", async (request, reply) => {
        console.log(`[${request.method}] ${request.url}`)
    })*/

    app.get("/", {preHandler:[checkSessionIdExist]}, async (request , reply) => {
        const { sessionId } = request.cookies

       const transactions = await knex("transactions").where("session_id", sessionId).select()
       return {
        transactions
    }
    })


    app.get("/:id", async (request) => {
        const getTransactionParamsSchema = z.object({ id: z.string().uuid(), })
        const { id } = getTransactionParamsSchema.parse(request.params)
        const {sessionId} = request.cookies

        const transactions = await knex("transactions")
        .where({
            session_id: sessionId,
            id: id,
        })
        .first()
       return { transactions }
    })

    

    app.get("/summary", {preHandler:[checkSessionIdExist]}, async (request , reply) => {
        const {sessionId} = request.cookies

        const summary = await knex("transactions").sum("amount",{ as: "amount"}).where("session_id", sessionId).first()
       return { summary }
    })



    app.post("/", async (request, reply) => {

        const createTransactionBodySchema = z.object({
          title: z.string(),
          amount: z.number(),
          type: z.enum(["credit","debit"]),
          
        })
        const { title, amount, type} = createTransactionBodySchema.parse(request.body)

        let sessionId = request.cookies.sessionId

        if(!sessionId){
            sessionId = randomUUID()
            reply.cookie("sessionId", sessionId, {
              path: "/",
              maxAge: 60 * 60 * 24 * 365, //1 ano
            })
  
        }
        await knex("transactions").insert({
          id: randomUUID(),
          title,
          amount: type === "credit"? amount: amount * -1,
          session_id: sessionId,
        })
        return reply.status(201).send()
      })

}