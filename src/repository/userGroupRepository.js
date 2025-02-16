"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserGroupRepository = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class UserGroupRepository {
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
        return prisma.userGroup.create({ data: { text: data["text"] } });
    }
    async update(id, text) {
        return prisma.userGroup.update({
            where: { id },
            data: { text },
        });
    }
    async deleteById(id) {
        return prisma.userGroup.delete({ where: { id } });
    }
}
exports.UserGroupRepository = UserGroupRepository;
