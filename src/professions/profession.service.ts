import { Connection, Repository } from 'typeorm';
import { Profession } from './profession.entity';

export class ProfessionsService {
  private professionsRepository: Repository<Profession>;

  constructor(private readonly connection: Connection) {
    this.professionsRepository = connection.getRepository(Profession);
  }

  async getProfession(id: number) {
    try {
      return await this.professionsRepository.findOne({ where: { id } });
    } catch (err) {
      throw err;
    }
  }

  async getAllProfessions() {
    try {
      return await this.professionsRepository.find();
    } catch (err) {
      throw err;
    }
  }

  async createProfession(body) {
    try {
      const newProfession = this.professionsRepository.create({
        name: body.name,
      });
      return await this.professionsRepository.save(newProfession);
    } catch (err) {
      throw err;
    }
  }

  async editProfession(id, body) {
    try {
      const profession = await this.getProfession(id);
      const editedProfessionBody = { ...profession, name: body.name };
      return await this.professionsRepository.save(editedProfessionBody);
    } catch (err) {
      throw err;
    }
  }

  async deleteProfession(id: number) {
    try {
      return await this.professionsRepository.delete(id);
    } catch (err) {
      throw err;
    }
  }
}
