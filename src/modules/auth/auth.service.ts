import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { instanceToPlain } from 'class-transformer';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(dto: CreateUserDto) {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('Email déjà existante');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const createdUser = await this.usersService.create({
      ...dto,
      password: hashedPassword,
    });

    return instanceToPlain(createdUser);
  }

  async signIn(email: string, pass: string): Promise<{ access_token: string }> {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    if (!(await bcrypt.compare(pass, user.password))) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user.id, username: user.name, role: user.role };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
