"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.peopleService = void 0;
const knexConfig = require("../../knexfile");
const knex = require("knex")(knexConfig.development);
const peopleService = () => {
    return knex.select("*").from("people");
};
exports.peopleService = peopleService;
