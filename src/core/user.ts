import { userRepository } from "@/services/db/repositories/index.js";
import { emailsQueue } from "@/services/emails/queue.js";
import type { Group } from "./group.js";

export interface User {
  userId: string;
  name: string;
  email: string;
  group?: Group;
  groupId?: string;
}

export async function createUser(data: Omit<User, "userId">): Promise<User> {
  const user = await userRepository.create(data);

  return user;
}

export async function scheduleSignUpEmail(user: User) {
  await emailsQueue.add(
    "signUpEmail",
    { title: "My title", body: "My body", recipient: user.email },
    { delay: 1000 },
  );
}
