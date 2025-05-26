import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Project } from '../projects/entities/project.entity';
import { Investment } from './entities/investment.entity';
import { CreateInvestmentDto } from './dto/createInvestmentDto';

@Injectable()
export class InvestmentsService {
  constructor(
    @InjectRepository(Investment)
    private readonly investmentRepo: Repository<Investment>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,
  ) {}

  async create(dto: CreateInvestmentDto): Promise<any> {
    const investor = await this.userRepo.findOne({
      where: { id: dto.investorId },
    });
    if (!investor) throw new NotFoundException('Investor not found');
    const project = await this.projectRepo.findOne({
      where: { id: dto.projectId },
    });
    if (!project) throw new NotFoundException('Project not found');
    const investment = this.investmentRepo.create({
      ...dto,
      investor,
      project,
    });
    await this.investmentRepo.save(investment);

    return { message: 'investissement créé avec succès' };
  }

  async findAll(): Promise<Investment[]> {
    return this.investmentRepo.find();
  }

  async findAllForUser(id: string): Promise<Investment[]> {
    return this.investmentRepo.find({
      where: { investor: { id: id } },
      relations: ['project'],
    });
  }

  async findByProject(projectId: string): Promise<Investment[]> {
    return this.investmentRepo.find({
      where: { project: { id: projectId } },
      relations: ['investor', 'project'],
    });
  }

  async remove(id: string) {
    return this.investmentRepo.delete(id);
  }
}