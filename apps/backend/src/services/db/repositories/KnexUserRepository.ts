import type { Knex } from "knex";
import { ulid } from "ulid";
import type { GroupStatus, User } from "weft-domain";
import { type UserColumns, UserModel } from "@/services/db/entities/User.js";
import { AppError } from "@/app/errors.js";
import { GroupModel } from "../entities/Group.js";

export class KnexUserRepository {
  constructor(private knex: Knex) {}

  async paginate(limit: number = 5, nextToken: string): Promise<{ hasNext: boolean; users: User[] }> {
    const result = await UserModel.query(this.knex)
      .withGraphFetched("group")
      .where("userId", ">", nextToken)
      .limit(limit + 1);

    const hasNext = result.length === limit + 1;
    const users = result.map((u) => u.toDomainEntity());

    if (hasNext) {
      return { hasNext, users: users.slice(0, users.length - 1) };
    }

    return { hasNext, users };
  }

  async create(data: Omit<User, "userId">): Promise<User> {
    const user = await UserModel.query(this.knex)
      .insert({
        userId: ulid(),
        name: data.name,
        email: data.email,
        groupId: data.groupId,
      })
      .returning(["userId", "name", "email", "groupId"]);

    return user.toDomainEntity();
  }

  async findByName(name: string): Promise<User[]> {
    return this.findBy("name", name);
  }

  async findByEmail(email: string): Promise<User[]> {
    return this.findBy("email", email);
  }

  async removeUserFromGroup(
    userId: string,
  ): Promise<{ groupId: string; userId: string; groupStatus: string }> {
    const trx = await this.knex.transaction();

    try {
      const targetUser = await trx<UserModel>("users").where({ userId });

      if (targetUser?.length === 0) {
        throw new AppError("User not found");
      }

      if (targetUser[0].groupId == null) {
        throw new AppError("User is not in any group");
      }

      const targetGroupId = targetUser[0].groupId;

      await trx("users").where({ userId }).update({ groupId: null });

      const countOfUsersInGroup = await trx("users").count().where({
        groupId: targetGroupId,
      });

      let groupStatus: GroupStatus = "NotEmpty";

      if (countOfUsersInGroup[0].count == 0) {
        await trx<GroupModel>("groups")
          .where({ groupId: targetGroupId })
          .update({ status: "Empty" })
          .returning("status");

        groupStatus = "Empty";
      }

      await trx.commit();

      return { groupStatus, userId, groupId: targetGroupId };
    } catch (error: any) {
      await trx.rollback();

      console.log(error);

      throw new AppError(`Error while removing user from the group! ${error.message}`);
    }
  }

  private async findBy(col: UserColumns, val: string | number): Promise<User[]> {
    const result = await UserModel.query(this.knex).where(col, "=", val);

    return result.map((u) => u.toDomainEntity());
  }
}
