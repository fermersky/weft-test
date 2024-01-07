import Knex from "knex";
import { ulid } from "ulid";
import { GroupModel } from "./entities/Group.js";
import { UserModel } from "./entities/User.js";

export const knex = Knex({
  client: "pg",

  connection: {
    host: process.env["PG_HOST"],
    port: 5432,
    user: "postgres",
    database: "weft",
    password: "postgres",
  },
});

knex.raw("SELECT 1").then(() => console.log("🧳 successfully connected to the db"));

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

  await GroupModel.query(knex).insert({
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
    // groupId: basicGroupId,
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
