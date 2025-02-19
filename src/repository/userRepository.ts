import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class UserRepository {
  async verifyEntityDependencies(userId) {
    return prisma.user.findFirst({
      where: { id: userId },
      include: { responses: true },
    });
  }

  async verifyUniqueProperties(email, phoneNumber) {
    return prisma.user.findFirst({
      where: {
        OR: [{ email }, { phone_number: phoneNumber }],
      },
    });
  }

  async findByEmail(email) {
    return prisma.user.findFirst({
      where: { email },
      include: {
        user_groups: true
      }
    });
  }

  async findAll(queryParam) {
    let filter = {};
    
    if (queryParam["phone-number"]) {
      filter["phone_number"] = { startsWith: queryParam["phone-number"] };
    }

    if (queryParam["email"]) {
      filter["email"] = { startsWith: queryParam["email"] };
    }

    if (!isNaN(queryParam["user-group-id"])) {
      filter["user_group_id"] = Number(queryParam["user-group-id"]);
    }

    return prisma.user.findMany({
      skip: queryParam["pg"] ? Number(queryParam["qt"]) * (Number(queryParam["pg"]) - 1) : 0,
      take: queryParam["qt"] ? Number(queryParam["qt"]) : 100,
      where: filter,
      include: { user_groups: true },
    });
  }

  async findById(id) {
    return prisma.user.findUnique({
      where: { id },
      include: { user_groups: true },
    });
  }

  async create(userData) {
    return prisma.user.create({
      data: {
        phone_number: userData["phone_number"],
        user_groups: { connect: userData["user_groups"] },
        email: userData["email"],
        password: userData["password"],
      },
    });
  }

  async update(userId, userData) {
    return prisma.user.update({
      where: { id: userId },
      data: {
        phone_number: userData["phone_number"],
        user_groups: { set: userData["user_groups"].map(({ id }) => ({ id })) },
        email: userData["email"],
        password: userData["password"],
      },
    });
  }

  async deleteById(userId) {
    await prisma.user.update({
      where: { id: userId },
      data: { user_groups: { set: [] } },
    });

    return prisma.user.delete({ where: { id: userId } });
  }
}
