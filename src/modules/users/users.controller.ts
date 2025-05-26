import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { RoleGuard } from '../auth/auth.guard';
import { Role } from './enum/role';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(RoleGuard([Role.admin]))
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(RoleGuard([Role.admin, Role.entrepreneur, Role.investor]))
  @Get('profile')
  profile() {
    // return this.usersService.findAll();
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
