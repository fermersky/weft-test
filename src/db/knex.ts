import Knex from "knex";
import { User } from "./entities/User.js";
import { Group } from "./entities/Group.js";

import { v4 as uuid } from "uuid";

export const knex = Knex({
  client: "pg",

  connection: {
    host: "localhost",
    port: 5432,
    user: "postgres",
    database: "weft",
    password: "postgres",
  },
});

async function createUserRelation() {
  await knex.raw("DROP TABLE IF EXISTS users CASCADE;");

  await knex.schema.createTable("users", (table) => {
    table.uuid("id").primary();
    table.uuid("groupId").references("groups.id");
    table.string("name").notNullable();
    table.string("email").notNullable();
  });
}

async function createGroupsRelation() {
  await knex.raw("DROP TABLE IF EXISTS groups CASCADE;");

  await knex.schema.createTable("groups", (table) => {
    table.uuid("id").primary();
    table.string("name").notNullable();
    table.string("status").nullable();
  });
}

async function initializeSeedData() {
  const basicGroupId = uuid();

  await Group.query(knex).insert({
    id: basicGroupId,
    name: "Group 1",
    status: "NotEmpty",
  });

  await User.query(knex).insert({
    id: uuid(),
    name: "Dan",
    email: "dan@gmail.com",
    // groupId: basicGroupId,
  });

  await User.query(knex).insert({
    id: uuid(),
    name: "Ann",
    email: "ann@gmail.com",
    groupId: basicGroupId,
  });

  await User.query(knex).insert({
    id: uuid(),
    name: "Max",
    email: "max@gmail.com",
    groupId: basicGroupId,
  });
}

export async function createDbSchema() {
  await createGroupsRelation();
  await createUserRelation();

  await initializeSeedData();
}
