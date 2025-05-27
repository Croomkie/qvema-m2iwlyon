import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '../auth/auth.guard';
import { Role } from './enum/role';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { UserDto } from './dto/user.dto';
import { SetUserInterestsDto } from '../interest/dto/setUserInterestsDto';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { Interest } from '../interest/entities/interest.entity';

@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiResponse({ type: [UserDto] })
  @UseGuards(AuthGuard, RolesGuard)
  @Get()
  @Roles(Role.admin)
  findAll() {
    return this.usersService.findAll();
  }

  @ApiResponse({ type: UserDto })
  @UseGuards(AuthGuard)
  @Get('profile')
  async getProfile(@Req() req: any): Promise<UserDto | null> {
    try {
      return await this.usersService.getUser(req.user.sub);
    } catch {
      throw new UnauthorizedException();
    }
  }

  @UseGuards(AuthGuard)
  @Put('profile')
  async update(
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: any,
  ): Promise<void> {
    return await this.usersService.update(req.user.sub, updateUserDto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Delete(':id')
  @Roles(Role.admin)
  async remove(@Param('id') id: string) {
    return await this.usersService.remove(id);
  }

  @Post('interests')
  @UseGuards(AuthGuard)
  async setInterests(@Body() dto: SetUserInterestsDto, @Req() req: any) {
    return this.usersService.setUserInterests(req.user.sub, dto.interestIds);
  }

  @ApiResponse({ type: [Interest] })
  @Get('interests')
  @UseGuards(AuthGuard)
  async getInterests(@Req() req: any) {
    return this.usersService.getUserInterests(req.user.sub);
  }
}
