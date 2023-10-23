import { Model } from "objection";

export type GroupStatus = "NotEmpty" | "Empty";

export class Group extends Model {
  id!: string;
  name!: string;
  status!: string;

  static tableName = "groups";

  static get jsonSchema() {
    return {
      type: "object",
      required: ["id", "name", "status"],
      properties: {
        id: { type: "string" },
        name: { type: "string", minLength: 1, maxLength: 255 },
        status: { type: "string", enum: ["NotEmpty", "Empty"] },
      },
    };
  }
}
