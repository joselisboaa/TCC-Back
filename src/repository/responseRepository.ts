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
        responseOrientations: {
          include: {
            orientation: {
              include: {
                answer: {
                  include: {
                    question: true,
                  },
                },
              },
            },
          },
        },
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
      include: {
        user: true,
        responseOrientations: {
          include: { orientation: true }
        }
      },
    });    
  }  

  async create(data) {
    const response = await prisma.response.create({
      data: {
        timestamp: new Date(),
        user_id: data["user_id"],
      },
    });
  
    if (data["orientations"]?.length) {
      for (const orientation of data["orientations"]) {
        await prisma.responseOrientation.create({
          data: {
            response_id: response.id,
            orientation_id: Number(orientation.id),
          },
        });
      }
    }
  
    return response;
  }

  async update(data) {
    await prisma.responseOrientation.deleteMany({
      where: { response_id: data["id"] },
    });
  
    if (data["orientations"]?.length) {
      for (const orientation of data["orientations"]) {
        await prisma.responseOrientation.create({
          data: {
            response_id: data["id"],
            orientation_id: Number(orientation.id),
          },
        });
      }
    }
  
    return prisma.response.update({
      where: { id: data["id"] },
      data: {
        timestamp: new Date(),
        user_id: data["user_id"],
      },
    });
  }
  

  async deleteById(id) {
    await prisma.responseOrientation.deleteMany({
      where: { response_id: id },
    });
  
    return prisma.response.delete({ where: { id } });
  }  
}
