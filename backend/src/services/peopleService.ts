const knexConfig = require("../../knexfile");
const knex = require("knex")(knexConfig.development);

export const peopleService = () => {
  return knex.select("*").from("people");
};
