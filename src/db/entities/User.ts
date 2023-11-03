import { Model } from "objection";

export interface User {
  userId: string;
  name: string;
  email: string;
  groupId?: string;
}

export class UserModel extends Model implements User {
  userId!: string;
  name!: string;
  email!: string;
  groupId?: string;

  static get tableName() {
    return "users";
  }

  static get idColumn() {
    return "userId";
  }

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
