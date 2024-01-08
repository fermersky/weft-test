import { Queue } from "bullmq";
import { redisClient } from "../redis/redis-client.js";

export interface SendEmailJob {
  title: string;
  recipient: string;
  body: string;
}

export const OUTBOUND_EMAILS_QUEUE = "outbound_emails";
export const emailsQueue = new Queue<SendEmailJob>(OUTBOUND_EMAILS_QUEUE, { connection: redisClient });

emailsQueue.obliterate({ force: true });
