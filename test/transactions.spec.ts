import { expect, test, it, beforeAll, afterAll, describe} from "vitest"
import { app } from "../src/app"
import supertest from "supertest"
import { execSync } from "node:child_process"

describe("transactions routes", () => {
    beforeAll(async () => {
        await app.ready()
    })
    afterAll(async () => {
        await app.close()
    })

    beforeAll(async () => {
        execSync("npm run knex migrate:rollback --all")
        execSync("npm run knex migrate:latest")
    })
    
    it("user can create a new trasaction", async () => {
        await supertest(app.server)
        .post("/transactions")
        .send({
            title:"new transaction",
            amount: 5000,
            type:"credit"
        })
        .expect(201)
    })

    it("O USUARIO DEVE PODER OBTER UM RESUMO DA SUA CONTA", async () => {

        const createTransactionResponse = await supertest(app.server)
        .post("/transactions")
        .send({
            title:"new transaction",
            amount: 5000,
            type:"credit"
        })

        const cookies : string[] | undefined = createTransactionResponse.get("Set-Cookie")

         await supertest(app.server)
        .post("/transactions")
        .set("Cookie", cookies)
        .send({
            title:"new transaction debit",
            amount: 1500,
            type:"debit"
        })

        const summaryResponse = await supertest(app.server)
        .get("/transactions/summary")
        .set("Cookie", cookies)
        .expect(200)

        expect(summaryResponse.body.summary).toEqual({
            amount:3500
        })

        //console.log(summaryResponse.body.summary)

    })




    it("O USUARIO DEVE PODER OBTER LISTAR TODAS AS TRANSAÇÕES QUE JÁ OCORRERAM", async () => {
        const createTransactionResponse = await supertest(app.server)
        .post("/transactions")
        .send({
            title:"new transaction",
            amount: 5000,
            type:"credit"
        })

        const cookies : string[] | undefined = createTransactionResponse.get("Set-Cookie")

        const resumoTransactionResponse = await supertest(app.server)
        .get("/transactions")
        .set("Cookie", cookies)
        .expect(200)

    })


    it("O USUARIO DEVE PODER VISUALIZAR UM TRANSAÇÃO UNICA", async () => {
        const createTransactionResponse = await supertest(app.server)
        .post("/transactions")
        .send({
            title:"new transaction",
            amount: 5000,
            type:"credit"
        })

        const cookies : string[] | undefined = createTransactionResponse.get("Set-Cookie")
        
        const resumoTransaction = await supertest(app.server)
        .get("/transactions")
        .set("Cookie", cookies)
        .expect(200)


        const resumoTransactionResponse = await supertest(app.server)
        .get(`/transactions/${resumoTransaction.body.transactions[0].id}`)
        .set("Cookie", cookies)
        .expect(200)

    })
})
