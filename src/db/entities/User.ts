import { Model } from "objection";

export class User extends Model {
  id!: string;
  name!: string;
  email!: string;
  groupId?: string;

  static get tableName() {
    return "users";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["id", "name", "email"],
      properties: {
        id: { type: "string" },
        name: { type: "string", minLength: 1, maxLength: 255 },
        email: { type: "string", minLength: 1, maxLength: 255 },
        groupId: { type: "string" },
      },
    };
  }
}
