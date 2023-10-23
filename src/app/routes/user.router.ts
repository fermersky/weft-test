import { Router } from "express";
import { userRepository } from "../../db/repositories/index.js";
import {
  FindUserByEmailQueryParams,
  FindUserByNameQueryParams,
  PaginateUsersQueryParams,
  RemoveUserFromGroupQueryParams,
} from "./user.validation.js";
import { handleErrors } from "../handlers.js";

const router = Router();

router.get("/paginate", async (req, res) => {
  const result = await handleErrors(async () => {
    const { limit, nextToken } = await PaginateUsersQueryParams.parseAsync(req.query);

    const page = await userRepository.paginate(limit, nextToken);

    return { data: page, status: 200 };
  });

  res.status(result.status).json(result);
});

router.get("/find-by-name/:name", async (req, res) => {
  const result = await handleErrors(async () => {
    const { name } = await FindUserByNameQueryParams.parseAsync(req.params);

    const users = await userRepository.findByName(name);

    return { data: users, status: 200 };
  });

  res.status(result.status).json(result);
});

router.get("/find-by-email/:email", async (req, res) => {
  const result = await handleErrors(async () => {
    const { email } = await FindUserByEmailQueryParams.parseAsync(req.params);

    const users = await userRepository.findByEmail(email);

    return { data: users, status: 200 };
  });

  res.status(result.status).json(result);
});

router.get("/remove-from-group/:userId", async (req, res) => {
  const result = await handleErrors(async () => {
    const { userId } = await RemoveUserFromGroupQueryParams.parseAsync(req.params);
    const groupId = await userRepository.removeUserFromGroup(userId);

    return { data: { groupId }, status: 200 };
  });

  res.status(result.status).json(result);
});

export default router;
