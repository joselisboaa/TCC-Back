import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ResponseRepository {
  async findAll(queryParam) {
    let filter = {};

    const orientationId = queryParam["orientation-id"];
    if (!isNaN(orientationId)) {
      filter["orientation_id"] = Number(orientationId);
    }

    const userId = queryParam["user-id"];
    if (!isNaN(userId)) {
      filter["user_id"] = Number(userId);
    }

    return prisma.response.findMany({
      skip: queryParam["pg"] == null ? 0 : Number(queryParam["qt"]) * (Number(queryParam["pg"]) - 1),
      take: queryParam["qt"] == null ? 100 : Number(queryParam["qt"]),
      where: filter,
      include: { 
        orientations: true, 
        user: {
          select: {
            phone_number: true,
            email: true,
            name: true,
            user_groups: {
              select: {
                text: true
              }
            },
          }
        }
      },
    });
  }

  async findById(id) {
    return prisma.response.findUnique({
      where: { id },
      include: { orientations: true },
    });
  }

  async create(data) {
    return prisma.response.create({
      data: {
        timestamp: new Date(),
        orientations: { connect: data["orientations"] },
        user_id: data["user_id"],
      },
    });
  }

  async update(data) {
    return prisma.response.update({
      where: { id: data["id"] },
      data: {
        timestamp: new Date(),
        orientations: { set: data["orientations"].map(({ id }) => ({ id })) },
        user_id: data["user_id"],
      },
    });
  }

  async deleteById(id) {
    await prisma.response.update({
      where: { id },
      data: { orientations: { set: [] } },
    });

    return prisma.response.delete({ where: { id } });
  }
}
