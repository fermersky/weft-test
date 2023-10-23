import express from "express";
import { createDbSchema, knex } from "./db/knex.js";
import UserRouter from "./app/routes/user.js";

const httpApp = express();

httpApp.use(UserRouter);

async function main() {
  try {
    await createDbSchema();

    httpApp.listen(8000, () =>
      console.log("🚀 server is running on port 8000")
    );
  } catch (er) {
    console.log(er);
  }
}

main();
