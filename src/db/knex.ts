import Knex from "knex";
import { UserModel } from "./entities/User.js";
import { Group } from "./entities/Group.js";

import { ulid } from "ulid";

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
    table.string("userId").primary();
    table.string("groupId").references("groups.groupId");
    table.string("name").notNullable();
    table.string("email").notNullable();
  });
}

async function createGroupsRelation() {
  await knex.raw("DROP TABLE IF EXISTS groups CASCADE;");

  await knex.schema.createTable("groups", (table) => {
    table.string("groupId").primary();
    table.string("name").notNullable();
    table.string("status").nullable();
  });
}

async function initializeSeedData() {
  const basicGroupId = ulid();

  await Group.query(knex).insert({
    groupId: basicGroupId,
    name: "Group 1",
    status: "NotEmpty",
  });

  await UserModel.query(knex).insert({
    userId: ulid(),
    name: "Dan",
    email: "dan@gmail.com",
    groupId: basicGroupId,
  });

  await UserModel.query(knex).insert({
    userId: ulid(),
    name: "Ann",
    email: "ann@gmail.com",
    groupId: basicGroupId,
  });

  await UserModel.query(knex).insert({
    userId: ulid(),
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
