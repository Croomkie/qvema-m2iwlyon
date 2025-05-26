import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../users/enum/role';

@Controller('investments')
export class InvestmentsController {
  @UseGuards(AuthGuard, RolesGuard)
  @Get()
  @Roles(Role.investor)
  getInvestments() {}

  @UseGuards(AuthGuard, RolesGuard)
  @Post()
  @Roles(Role.investor)
  addInvestments() {}

  @UseGuards(AuthGuard)
  @Get('project/:id')
  getInvestmentsProject(@Param('id') id: string) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Delete(':id')
  @Roles(Role.investor)
  deleteInvestment(@Param('id') id: string) {}
}
