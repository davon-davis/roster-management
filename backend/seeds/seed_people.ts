import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("people").del();

  // Inserts seed entries
  await knex("people").insert([
    { first_name: "Tiger", last_name: "Woods" },
    { first_name: "Denzel", last_name: "Washington" },
    { first_name: "Ryan", last_name: "Gosling" },
  ]);
}
