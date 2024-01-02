import "dotenv/config";

import fastify from "fastify";
import { createDbSchema } from "./db/knex.js";
import UserRouter from "./app/routes/user.router.js";

const app = fastify();

app.register(UserRouter);

app.addHook("onReady", (done) => {
  console.log("🚀 server is running on port 8000");

  done();
});

async function main() {
  try {
    await createDbSchema();

    app.listen({ port: 8000 });
  } catch (er) {
    console.log(er);
  }
}

main();
