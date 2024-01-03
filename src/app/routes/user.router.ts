import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { userRepository } from "../../db/repositories/index.js";
import {
  CreateUserBodySchema,
  FindUserByEmailQueryParams,
  FindUserByNameQueryParams,
  PaginateUsersQueryParams,
  RemoveUserFromGroupQueryParams,
} from "./user.validation.js";
import { handleErrors } from "../handlers.js";

const userRoutes = async (fastify: FastifyInstance) => {
  fastify.get("/paginate", async (request: FastifyRequest, reply: FastifyReply) => {
    const result = await handleErrors(async () => {
      const { limit, nextToken } = await PaginateUsersQueryParams.parseAsync(request.query);

      const page = await userRepository.paginate(limit, nextToken);

      return { data: page, status: 200 };
    });

    reply.status(result.status).send(result);
  });

  fastify.post("/create", async (request: FastifyRequest, reply: FastifyReply) => {
    const result = await handleErrors(async () => {
      const userRequestPayload = await CreateUserBodySchema.parseAsync(request.body);
      const user = await userRepository.create(userRequestPayload);

      return { data: user, status: 201 };
    });

    reply.status(result.status).send(result);
  });

  fastify.get("/find-by-name/:name", async (request: FastifyRequest, reply: FastifyReply) => {
    const result = await handleErrors(async () => {
      const { name } = await FindUserByNameQueryParams.parseAsync(request.params);

      const users = await userRepository.findByName(name);

      return { data: users, status: 200 };
    });

    reply.status(result.status).send(result);
  });

  fastify.get("/find-by-email/:email", async (request: FastifyRequest, reply: FastifyReply) => {
    const result = await handleErrors(async () => {
      const { email } = await FindUserByEmailQueryParams.parseAsync(request.params);

      const users = await userRepository.findByEmail(email);

      return { data: users, status: 200 };
    });

    reply.status(result.status).send(result);
  });

  fastify.get("/remove-from-group/:userId", async (request: FastifyRequest, reply: FastifyReply) => {
    const result = await handleErrors(async () => {
      const { userId } = await RemoveUserFromGroupQueryParams.parseAsync(request.params);
      const group = await userRepository.removeUserFromGroup(userId);

      return { data: { group }, status: 200 };
    });

    reply.status(result.status).send(result);
  });
};

export default userRoutes;
