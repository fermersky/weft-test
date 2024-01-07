import { Worker } from "bullmq";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { redisClient } from "../redis/redis-client.js";
import { type SendEmailJob, emailsQueue } from "./queue.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const workerScript = join(__dirname, "processor.js");

const emptyProcessor = async () => 0;
const processor = process.env["NODE_ENV"] === "production" ? workerScript : emptyProcessor;

// instead of a worker script, here could be a regular async function (sending emails in a separate thread doesn't make any sense)
export const worker = new Worker<SendEmailJob, number>(emailsQueue.name, processor, {
  connection: redisClient,
  useWorkerThreads: true,
});

worker.on("completed", (job, returnValue) => {
  console.log({ returnValue });
});

worker.on("failed", (job, error) => {
  console.log("here in error");
});

worker.on("error", (err) => {
  console.error(err);
});
