import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { RoleGuard } from '../auth/auth.guard';
import { Role } from './enum/role';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';
import { UserDto } from './dto/user.dto';

@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  @UseGuards(RoleGuard([Role.admin]))
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(RoleGuard([Role.admin, Role.entrepreneur, Role.investor]))
  @Get('profile')
  async getProfile(@Req() req): Promise<UserDto | null> {
    try {
      return await this.usersService.getUser(req.sub);
    } catch {
      throw new UnauthorizedException();
    }
  }

  @UseGuards(RoleGuard([Role.admin, Role.entrepreneur, Role.investor]))
  @Put('profile')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @UseGuards(RoleGuard([Role.admin]))
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
