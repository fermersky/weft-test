import { z } from "zod";

export const PaginateUsersQueryParams = z.object({
  limit: z.coerce.number().min(0),
  nextToken: z.coerce.string().default("0"),
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
