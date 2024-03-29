import { Model } from "objection";
import type { User } from "@/core/user.js";
import { GroupModel } from "./Group.js";

export interface UserModelSchema {
  userId: string;
  name: string;
  email: string;
  groupId?: string;
}

export type UserColumns = keyof UserModelSchema;

export class UserModel extends Model implements UserModelSchema {
  userId!: string;
  name!: string;
  email!: string;
  groupId?: string;

  group?: GroupModel;

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

  toDomainEntity(): User {
    return {
      userId: this.userId,
      name: this.name,
      email: this.email,
      groupId: this.groupId,
      group: this.group?.toDomainEntity(),
    };
  }
}
