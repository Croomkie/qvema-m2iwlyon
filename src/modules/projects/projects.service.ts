import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { User } from '../users/entities/user.entity';
import { Role } from '../users/enum/role';
import { UpdateProjectDto } from './dto/update-project.dto';
import { CreateProjectDto } from './dto/create-project.dto';
import { plainToInstance } from 'class-transformer';
import { UserDto } from '../users/dto/user.dto';
import { ProjectDto } from './dto/projectDto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async create(dto: CreateProjectDto, ownerId: string): Promise<any> {
    const owner = await this.userRepo.findOneBy({ id: ownerId });
    if (!owner) throw new NotFoundException('Utilisateur non trouvé');

    const project = this.projectRepo.create({ ...dto, owner });
    await this.projectRepo.save(project);

    return { message: 'Projet créé' };
  }

  async findAll(): Promise<ProjectDto[]> {
    const projects = await this.projectRepo.find({ relations: ['owner'] });
    console.log('Projects found:', projects);
    return plainToInstance(
      ProjectDto,
      projects.map((project) => ({
        ...project,
        owner: plainToInstance(UserDto, project.owner, {
          excludeExtraneousValues: true,
        }),
      })),
      { excludeExtraneousValues: true },
    );
  }

  async findById(id: string): Promise<Project> {
    const project = await this.projectRepo.findOne({
      where: { id },
      relations: ['owner'],
    });
    if (!project) throw new NotFoundException('Projet introuvable');
    return project;
  }

  async update(
    id: string,
    dto: UpdateProjectDto,
    requester: any,
  ): Promise<any> {
    const project = await this.findById(id);

    if (requester.role !== Role.admin && project.owner.id !== requester.sub) {
      throw new ForbiddenException('Vous ne pouvez modifier que vos projets');
    }

    Object.assign(project, dto);
    await this.projectRepo.save(project);

    return { message: 'Projet mis à jour' };
  }

  async delete(id: string, requester: any): Promise<void> {
    const project = await this.findById(id);

    if (requester.role !== Role.admin && project.owner.id !== requester.sub) {
      throw new ForbiddenException('Vous ne pouvez supprimer que vos projets');
    }

    await this.projectRepo.delete(id);
  }

  //Fait avec GPT car je ne comprenais pas l'attendu ^^
  async getRecommendations(userId: string): Promise<Project[]> {
    // 1. Charger l'utilisateur et ses centres d'intérêt
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['interests'],
    });
    if (!user) throw new NotFoundException('Utilisateur non trouvé');

    const interests = user.interests.map((i) => i.name); // ex: ["Tech", "Sport"]

    // 2. Chercher les projets dont la catégorie est dans les intérêts
    if (!interests.length) return []; // pas d'intérêt -> pas de reco

    const projects = await this.projectRepo.find({
      where: interests.map((category) => ({ category })),
    });

    return projects;
  }
}
