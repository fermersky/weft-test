import { Model } from "objection";
import { GroupModel, type Group } from "./Group.js";

export interface User {
  userId: string;
  name: string;
  email: string;
  group?: Group;
  groupId?: string;
}

export class UserModel extends Model implements User {
  userId!: string;
  name!: string;
  email!: string;
  group?: Group;
  groupId?: string;

  static get tableName() {
    return "users";
  }

  static get idColumn() {
    return "userId";
  }

  static relationMappings = {
    group: {
      relation: Model.HasOneRelation,
      modelClass: GroupModel,
      join: {
        from: "users.groupId",
        to: "groups.groupId",
      },
    },
  };

  static get jsonSchema() {
    return {
      type: "object",
      required: ["userId", "name", "email"],
      properties: {
        userId: { type: "string" },
        name: { type: "string", minLength: 1, maxLength: 255 },
        email: { type: "string", minLength: 1, maxLength: 255 },
        groupId: { type: "string" },
      },
    };
  }
}
