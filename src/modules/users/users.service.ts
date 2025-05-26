import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { UserDto } from './dto/user.dto';
import { plainToInstance } from 'class-transformer';
import { Interest } from '../interest/entities/interest.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Interest)
    private readonly interestRepo: Repository<Interest>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepo.create(createUserDto);
    return this.userRepo.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { email } });
  }

  async findAll(): Promise<User[]> {
    return await this.userRepo.find();
  }

  async getUser(userId: string): Promise<UserDto | null> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return plainToInstance(UserDto, user, { excludeExtraneousValues: true });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<void> {
    await this.userRepo.update(id, updateUserDto);
  }

  async remove(id: string) {
    return await this.userRepo.delete(id);
  }

  async setUserInterests(userId: string, interestIds: string[]): Promise<void> {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['interests'],
    });

    if (!user) {
      throw new NotFoundException(`Utilisateur ${userId} introuvable`);
    }

    const newInterests = await this.interestRepo.findBy({ id: In(interestIds) });

    // Fusionner sans doublons
    const currentIds = new Set(user.interests.map(i => i.id));
    const combined = [...user.interests];

    for (const interest of newInterests) {
      if (!currentIds.has(interest.id)) {
        combined.push(interest);
      }
    }

    user.interests = combined;

    await this.userRepo.save(user);
  }

  async getUserInterests(userId: string): Promise<Interest[]> {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['interests'],
    });
    return user?.interests ?? [];
  }
}
