import { Queue } from "bullmq";

export interface SendEmailJob {
  title: string;
  recipient: string;
  body: string;
}

export const OUTBOUND_EMAILS_QUEUE = "outbound_emails";
export const emailsQueue = new Queue<SendEmailJob>(OUTBOUND_EMAILS_QUEUE);

emailsQueue.obliterate({ force: true });
