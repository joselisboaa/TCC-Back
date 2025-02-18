import { Answer, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class AnswerRepository {
  async findById(id: number) {
    return prisma.answer.findUnique({
      where: { id },
      include: { question: true, orientations: true }
    });
  }

  async findAll(queryParam) {
    let filter = {
      text: { startsWith: queryParam["text"] }
    };

    const questionId = queryParam["question-id"];
    if (!isNaN(questionId)) {
      filter["question"] = { id: Number(questionId) };
    }

    return await prisma.answer.findMany({
      skip: queryParam["pg"] ? (Number(queryParam["qt"]) * (Number(queryParam["pg"]) - 1)) : 0,
      take: queryParam["qt"] ? Number(queryParam["qt"]) : 100,
      where: filter,
      include: {
        question: {
          include: {
            user_group: true,
          },
        },
        orientations: true,
      },
    });
  }

  async create(data) {
    return prisma.answer.create({
      data: {
        text: data["text"],
        other: data["other"],
        question: { connect: { id: data["question_id"] } }
      }
    });
  }

  async update(data) {
    return prisma.answer.update({
      where: { id: data["id"] },
      data: {
        text: data["text"],
        other: data["other"],
        question: { connect: { id: data["question_id"] } }
      }
    });
  }

  async deleteById(id: number) {
    return prisma.answer.delete({ where: { id } });
  }

  async verifyEntityDependencies(answerId: number) {
    return prisma.answer.findFirst({
      where: { id: answerId },
      include: { orientations: true }
    });
  }

  async verifyUniqueProperties(text: string) {
    return prisma.answer.findFirst({
      where: { text }
    });
  }
}