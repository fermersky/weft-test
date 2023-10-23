import Knex from "knex";
import { User } from "../entities/User.js";
import { AppError } from "../../app/errors.js";

export class KnexUserRepository {
  constructor(private knex: Knex.Knex) {}

  async paginate(limit: number = 5, nextToken: string) {
    const users = await User.query(this.knex)
      .where("id", ">", nextToken)
      .limit(limit + 1);

    const hasNext = users.length === limit + 1;

    if (hasNext) {
      return { hasNext, users: users.slice(0, users.length - 1) };
    }

    return { hasNext, users };
  }

  async findByName(name: string) {
    return this.findBy("name", name);
  }

  async findByEmail(email: string) {
    return this.findBy("email", email);
  }

  async removeUserFromGroup(
    userId: string
  ): Promise<{ groupId: string; userId: string; groupStatus: string }> {
    const trx = await this.knex.transaction();

    try {
      const targetUser = await trx<User>("users").where({ id: userId });

      if (targetUser?.length === 0) {
        throw new AppError("User not found");
      }

      if (targetUser[0].groupId == null) {
        throw new AppError("User is not in any group");
      }

      const targetGroupId = targetUser[0].groupId;

      await trx("users").where({ id: userId }).update({ groupId: null });

      const countOfUsersInGroup = await trx("users").count().where({
        groupId: targetGroupId,
      });

      let groupStatus = "NotEmpty";

      if (countOfUsersInGroup[0].count == 0) {
        await trx("groups").where({ id: targetGroupId }).update({ status: "Empty" }).returning("status");

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

  private async findBy(col: string, val: string) {
    return await User.query(this.knex).where({ [col]: val });
  }
}
