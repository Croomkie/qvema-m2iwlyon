import { Controller, Get, UseGuards } from '@nestjs/common';
import { InterestService } from './interest.service';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../users/enum/role';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('interests')
export class InterestController {
  constructor(private readonly interestService: InterestService) {}

  @Get()
  getInterests() {
    return this.interestService.getInterests();
  }
}
