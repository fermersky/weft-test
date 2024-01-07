import "dotenv/config";
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

    app.listen({ port: 8000 });
  } catch (er) {
    console.log(er);
  }
}

main();

const gracefulShutdown = async (signal: "SIGINT" | "SIGTERM") => {
  await worker.close();
  await app.close();

  process.exit(0);
};

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
