import { QuestionRepository } from '../repository/questionRepository';

export class QuestionService {
  private repository = new QuestionRepository();

  async verifyEntityDependencies(req, res) {
    return this.repository.verifyEntityDependencies(req.params["id"]);
  }

  async verifyUniqueProperties(req) {
    return this.repository.verifyUniqueProperties(req.body["text"]);
  }

  async getExecuteQuery(query) {
    return this.repository.getExecuteQuery(query);
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
    const data = {
      id: res.locals.question["id"],
      text: req.body["text"],
      user_group_id: req.body["user_group_id"],
    };

    return this.repository.update(data);
  }

  async deleteById(data) {
    return this.repository.deleteById(data["id"]);
  }
}
