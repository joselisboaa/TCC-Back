import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class UserGroupRepository {
  async verifyEntityDependencies(userId) {
    return prisma.userGroup.findFirst({
      where: { id: userId },
      include: { users: true, questions: true },
    });
  }

  async findAll(queryParam) {
    let filter = queryParam["text"]
      ? { text: { startsWith: queryParam["text"] } }
      : {};

    return prisma.userGroup.findMany({
      skip: queryParam["pg"] == null ? 0 : Number(queryParam["qt"]) * (Number(queryParam["pg"]) - 1),
      take: queryParam["qt"] == null ? 100 : Number(queryParam["qt"]),
      where: filter,
    });
  }

  async findById(id) {
    return prisma.userGroup.findUnique({ where: { id } });
  }

  async create(data) {
    return prisma.userGroup.create({ data: { text: data["text"], description: data["description"] } });
  }

  async update(id, text, description) {
    return prisma.userGroup.update({
      where: { id },
      data: { text, description },
    });
  }

  async deleteById(id) {
    return prisma.userGroup.delete({ where: { id } });
  }
}
