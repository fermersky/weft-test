import { Model } from "objection";

export type GroupStatus = "NotEmpty" | "Empty";

export class Group extends Model {
  groupId!: string;
  name!: string;
  status!: string;

  static tableName = "groups";

  static get idColumn() {
    return "groupId";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["groupId", "name", "status"],
      properties: {
        groupId: { type: "string" },
        name: { type: "string", minLength: 1, maxLength: 255 },
        status: { type: "string", enum: ["NotEmpty", "Empty"] },
      },
    };
  }
}
