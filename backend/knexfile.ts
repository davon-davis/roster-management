// Update the following settings with your database information
//
// At this time all of the functions in here relate to Knex and its initial configuration.
//

export const convertToSnakeCase = (value: string): string => {
  if (value.length === 0) {
    return "";
  }

  return value
    .replace(/[\w]([A-Z])/g, function (m) {
      return m[0] + "_" + m[1];
    })
    .toLowerCase();
};

export const convertToCamel = (value: string): string => {
  if (value.length === 0) {
    return "";
  }

  if (value.indexOf("_") === -1) {
    return value;
  }

  return value
    .toLowerCase()
    .replace(/[_|-](.)/g, function (match, group1: string) {
      return group1.toUpperCase();
    });
};

const mapKeys = (obj: { [key: string]: any }, fn: (key: string) => string) => {
  return Object.keys(obj).reduce(
    (acc, key) => {
      const newKey = fn(key);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      acc[newKey] = obj[key];
      return acc;
    },
    {} as { [key: string]: any },
  );
};

const convertType = (value: any): any => {
  switch (typeof value) {
    case "object":
      return mapKeys(value as object, convertToCamel);
    case "string":
      return convertToCamel(value);
    default:
      return value;
  }
};

export function knexCamelCaseMapper(result: any, _queryContext: any): any {
  if (Array.isArray(result)) {
    return result.map(convertType) as any;
  }

  return convertType(result);
}

module.exports = {
  development: {
    wrapIdentifier: (value: any, origImpl: any, _queryContext: any) =>
      origImpl(convertToSnakeCase(value)),
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return -- This is a Knex function whose signature specficically returns any.
    postProcessResponse: (result: any, queryContext: any) =>
      knexCamelCaseMapper(result, queryContext),
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
