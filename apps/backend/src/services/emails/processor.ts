import type { Job } from "bullmq";
import { isMainThread } from "worker_threads";
import type { SendEmailJob } from "./queue.js";

const sab = new SharedArrayBuffer(4);
const lock = new Int32Array(sab);

console.log({ isMainThread }); // should be false as this script is supposed to be running in a separate thread

export default async function (job: Job<SendEmailJob, number>) {
  console.log("started cpu bound task");
  Atomics.wait(lock, 0, 0, 10000); // synchronous lock
  console.log("finished cpu bound task");

  return 3;
}
