import { Controller, Get, UseGuards } from '@nestjs/common';
import { InterestService } from './interest.service';
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
