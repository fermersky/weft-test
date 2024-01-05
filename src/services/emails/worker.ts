import { Worker } from "bullmq";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { type SendEmailJob, emailsQueue } from "./queue.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const workerScript = join(__dirname, "processor.js");

export async function initializeEmailsWorker() {
  const redis = await import("@/services/redis/redis-client.js");

  // instead of a worker script, here could be a regular async function (sending emails in a separate thread doesn't make any sense)
  const worker = new Worker<SendEmailJob, number>(emailsQueue.name, workerScript, {
    connection: redis.redisClient,
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
}
