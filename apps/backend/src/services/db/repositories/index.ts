import { knex } from "../knex.js";
import { KnexUserRepository } from "./KnexUserRepository.js";

export const userRepository = new KnexUserRepository(knex);
