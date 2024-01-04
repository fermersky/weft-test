import { Model } from "objection";
import type { Group } from "../../../core/group.js";

export class GroupModel extends Model implements Group {
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
