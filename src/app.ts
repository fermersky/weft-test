import "dotenv/config";
import fastify from "fastify";
import { createDbSchema } from "@/services/db/knex.js";
import { initializeEmailsWorker } from "@/services/emails/worker.js";
import UserRouter from "@/app/routes/user/user.router.js";

const app = fastify();

app.register(UserRouter);

app.addHook("onReady", (done) => {
  console.log("🚀 server is running on port 8000");

  done();
});

async function main() {
  try {
    await createDbSchema();

    if (process.env["NODE_ENV"] === "production") {
      await initializeEmailsWorker();
    }

    app.listen({ port: 8000 });
  } catch (er) {
    console.log(er);
  }
}

main();
