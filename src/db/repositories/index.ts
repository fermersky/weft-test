import { KnexUserRepository } from "./KnexUserRepository.js";
import { knex } from "../knex.js";

export const userRepository = new KnexUserRepository(knex);
