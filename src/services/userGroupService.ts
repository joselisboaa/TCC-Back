import { UserGroupRepository } from '../repository/userGroupRepository';

export class UserGroupService {
  private repository = new UserGroupRepository();

  async verifyEntityDependencies(req, res) {
    const userId = Number(req.params["id"]);
    return this.repository.verifyEntityDependencies(userId);
  }

  async verifyUniqueProperties(req) {
    return this.repository.verifyUniqueProperties(req.body["text"]);
  }

  async findAll(req, res) {
    return this.repository.findAll(req.query);
  }

  async findById(id) {
    return this.repository.findById(id);
  }

  async create(data) {
    return this.repository.create(data);
  }

  async update(req, res) {
    const id = res.locals.userGroup["id"];
    const text = req.body["text"];
    const description = req.body["description"]
    return this.repository.update(id, text, description);
  }

  async deleteById(data) {
    return this.repository.deleteById(data["id"]);
  }
}
