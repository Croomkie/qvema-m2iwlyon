import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Role } from './enum/role';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDto } from './dto/user.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
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

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
