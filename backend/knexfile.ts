// Update the following settings with your database information
module.exports = {
  development: {
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
