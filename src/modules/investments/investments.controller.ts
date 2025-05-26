import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { RolesGuard } from '../auth/roles.guard';
import { AuthGuard } from '../auth/auth.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../users/enum/role';
import { InvestmentsService } from './investments.service';
import { CreateInvestmentDto } from './dto/createInvestmentDto';

@ApiBearerAuth()
@Controller('investments')
export class InvestmentsController {
  constructor(private readonly investmentsService: InvestmentsService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Post()
  @Roles(Role.investor)
  create(@Body() dto: CreateInvestmentDto) {
    return this.investmentsService.create(dto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Get('admin/investments')
  @Roles(Role.admin)
  findAll() {
    return this.investmentsService.findAll();
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Get()
  @Roles(Role.investor)
  findAllForUser(@Req() req: any) {
    return this.investmentsService.findAllForUser(req.user.sub);
  }

  @Get('project/:id')
  findByProject(@Param('id') id: string) {
    return this.investmentsService.findByProject(id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Delete(':id')
  @Roles(Role.investor)
  remove(@Param('id') id: string) {
    return this.investmentsService.remove(id);
  }
}
