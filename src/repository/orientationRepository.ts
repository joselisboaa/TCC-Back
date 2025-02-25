import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class OrientationRepository {
  async findAll(queryParam) {
    let filter = {
      text: {
        startsWith: queryParam["text"]
      }
    };

    const answerId = queryParam["answer-id"];
    if (!isNaN(answerId)) {
      filter["answer_id"] = Number(answerId);
    }

    const query = {
      skip: queryParam["pg"] == null ? 0 : (Number(queryParam["qt"]) * (Number(queryParam["pg"]) - 1)),
      take: queryParam["qt"] == null ? 100 : Number(queryParam["qt"]),
      where: filter,
      include: {
        answer: {
          include: {
            question: {
              include: {
                user_group: true
              }
            }
          }
        }
      },
    };

    return prisma.orientation.findMany(query);
  }

  async findById(id) {
    return prisma.orientation.findUnique({
      where: { id },
      include: {
        answer: true
      }
    });
  }

  async findByAnswer(answerId) {
    return prisma.orientation.findFirst({
      where: { answer_id: answerId }
    });
  }

  async create(data) {
    return prisma.orientation.create({
      data: {
        text: data["text"],
        value: data["value"],
        answer: {
          connect: { id: data["answer_id"] },
        },
      },
    });
  }

  async update(data) {
    return prisma.orientation.update({
      where: { id: data["id"] },
      data: {
        text: data["text"],
        value: data["value"],
        answer: {
          connect: { id: data["answer_id"] },
        },
      },
    });
  }

  async deleteById(id) {
    return prisma.orientation.delete({
      where: { id }
    });
  }
}
