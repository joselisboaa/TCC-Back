"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionRepository = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class QuestionRepository {
    async verifyEntityDependencies(questionText) {
        return prisma.question.findFirst({
            where: { text: questionText },
            include: { answers: true },
        });
    }
    async verifyUniqueProperties(text) {
        return prisma.question.findFirst({
            where: { text },
        });
    }
    async getExecuteQuery(query) {
        return prisma.question.findMany(query);
    }
    async findAll(queryParam) {
        let filter = {
            text: {
                startsWith: queryParam["text"],
            },
        };
        const userGroupId = queryParam["user-group-id"];
        if (!isNaN(userGroupId)) {
            filter["user_group_id"] = Number(userGroupId);
        }
        return prisma.question.findMany({
            skip: queryParam["pg"] == null ? 0 : Number(queryParam["qt"]) * (Number(queryParam["pg"]) - 1),
            take: queryParam["qt"] == null ? 100 : Number(queryParam["qt"]),
            where: filter,
            include: { user_group: true }
        });
    }
    async findById(id) {
        return prisma.question.findUnique({
            where: { id },
            include: { user_group: true }
        });
    }
    async create(data) {
        return prisma.question.create({
            data: {
                text: data["text"],
                user_group: {
                    connect: { id: data["user_group_id"] },
                },
            },
        });
    }
    async update(data) {
        return prisma.question.update({
            where: { id: data["id"] },
            data: {
                text: data["text"],
                user_group: {
                    connect: { id: data["user_group_id"] },
                },
            },
        });
    }
    async deleteById(id) {
        return prisma.question.delete({
            where: { id },
        });
    }
}
exports.QuestionRepository = QuestionRepository;
