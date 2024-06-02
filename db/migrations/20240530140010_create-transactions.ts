import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("transactions", (table) => {
        table.uuid("id").primary()
        table.text("title").notNullable()
        table.decimal("amount",10,2).notNullable() //10 tamanho do numero e 2 quantidade de casas decimais
        table.timestamp("created_at").defaultTo(knex.fn.now()).notNullable()
    })
}
// criar migrations run knex -- migrate:make create-transactions
// criar tabelas npm run knex -- migrate:latest
// rodar esse codigo antes de editar uma migration tabelas npm run knex -- migrate:rollback

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable("transactions")
}

// desfazer a ultima atualização de criação de tabela
