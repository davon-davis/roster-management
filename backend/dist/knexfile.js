"use strict";
// Update the following settings with your database information
//
// At this time all of the functions in here relate to Knex and its initial configuration.
//
Object.defineProperty(exports, "__esModule", { value: true });
exports.knexCamelCaseMapper = exports.convertToCamel = exports.convertToSnakeCase = void 0;
const convertToSnakeCase = (value) => {
    if (value.length === 0) {
        return "";
    }
    return value
        .replace(/[\w]([A-Z])/g, function (m) {
        return m[0] + "_" + m[1];
    })
        .toLowerCase();
};
exports.convertToSnakeCase = convertToSnakeCase;
const convertToCamel = (value) => {
    if (value.length === 0) {
        return "";
    }
    if (value.indexOf("_") === -1) {
        return value;
    }
    return value
        .toLowerCase()
        .replace(/[_|-](.)/g, function (match, group1) {
        return group1.toUpperCase();
    });
};
exports.convertToCamel = convertToCamel;
const mapKeys = (obj, fn) => {
    return Object.keys(obj).reduce((acc, key) => {
        const newKey = fn(key);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        acc[newKey] = obj[key];
        return acc;
    }, {});
};
const convertType = (value) => {
    switch (typeof value) {
        case "object":
            return mapKeys(value, exports.convertToCamel);
        case "string":
            return (0, exports.convertToCamel)(value);
        default:
            return value;
    }
};
function knexCamelCaseMapper(result, _queryContext) {
    if (Array.isArray(result)) {
        return result.map(convertType);
    }
    return convertType(result);
}
exports.knexCamelCaseMapper = knexCamelCaseMapper;
module.exports = {
    development: {
        wrapIdentifier: (value, origImpl, _queryContext) => origImpl((0, exports.convertToSnakeCase)(value)),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return -- This is a Knex function whose signature specficically returns any.
        postProcessResponse: (result, queryContext) => knexCamelCaseMapper(result, queryContext),
        client: "pg",
        connection: {
            host: "127.0.0.1",
            user: "user",
            password: "password",
            database: "sandbox_db",
        },
        migrations: {
            directory: "./migrations",
            extension: "ts",
        },
        seeds: {
            directory: "./seeds",
            extension: "ts",
        },
    },
};
