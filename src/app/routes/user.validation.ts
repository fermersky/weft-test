import { z } from "zod";

export const PaginateUsersQueryParams = z.object({
  nextToken: z.coerce.string().default("0"),
  limit: z.coerce
    .number()
    .min(0)
    .nullish()
    .transform((x) => x ?? undefined),
});

export const FindUserByNameQueryParams = z.object({
  name: z.string(),
});

export const FindUserByEmailQueryParams = z.object({
  email: z.string().email(),
});

export const RemoveUserFromGroupQueryParams = z.object({
  userId: z.string().ulid(),
});

export const CreateUserBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  groupId: z
    .string()
    .ulid()
    .nullish()
    .transform((x) => x ?? undefined),
});
