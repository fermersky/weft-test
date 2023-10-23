import Knex from "knex";
import { User } from "../entities/User.js";

export class KnexUserRepository {
  constructor(private knex: Knex.Knex) {}

  async paginate(limit: number, offset: number) {
    return await User.query(this.knex).page(offset * limit, limit);
  }

  async create(id: string, name: string, email: string, groupId: string) {
    await User.query(this.knex).insert({
      id,
      name,
      email,
      groupId,
    });
  }

  async findByName(name: string) {
    return this.findBy("name", name);
  }

  async findByEmail(email: string) {
    return this.findBy("email", email);
  }

  async removeUserFromGroup(userId: string) {
    const trx = await this.knex.transaction();

    try {
      const targetUser = await trx("users").where({ id: userId });

      console.log({ targetUser });

      if (targetUser?.length === 0) {
        throw new Error("User not found");
      }

      if (targetUser[0].groupId == null) {
        throw new Error("User is not in any group");
      }

      const targetGroupId = targetUser[0].groupId;

      await trx("users").where({ id: userId }).update({ groupId: null });

      const countOfUsersInGroup = await trx("users").count().where({
        groupId: targetGroupId,
      });

      console.log({ countOfUsersInGroup });

      if (countOfUsersInGroup[0].count == 0) {
        await trx("groups")
          .where({ id: targetGroupId })
          .update({ status: "Empty" });
      }

      await trx.commit();
    } catch (error: any) {
      await trx.rollback();

      console.log(error);

      throw new Error(
        `Error while removing user from the group! ${error.message}`
      );
    }
  }

  private async findBy(col: string, val: string) {
    return await User.query(this.knex).where({ [col]: val });
  }
}
