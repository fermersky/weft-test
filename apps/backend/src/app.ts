import gracefulShutdown from "close-with-grace";
import "dotenv/config";
import esMain from "es-main";
import fastify from "fastify";
import { createDbSchema } from "@/services/db/knex.js";
import { worker } from "@/services/emails/worker.js";
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

    app.listen({ port: 8000, host: "0.0.0.0" });
  } catch (er) {
    console.log(er);
  }
}

if (esMain(import.meta)) {
  main();
}

gracefulShutdown({ delay: 1000 }, async function ({ signal, err }) {
  if (err) {
    console.error(err);
  }

  await worker.close();
  await app.close();
});
