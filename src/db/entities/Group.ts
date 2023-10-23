import { Model } from "objection";
import { User } from "./User.js";

export class Group extends Model {
  static tableName = "groups";

  static relationMappings = {
    animals: {
      relation: Model.HasManyRelation,
      modelClass: User,
      join: {
        from: "groups.id",
        to: "users.groupId",
      },
    },
  };
}
