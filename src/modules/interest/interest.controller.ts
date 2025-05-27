import { Controller, Get, UseGuards } from '@nestjs/common';
import { InterestService } from './interest.service';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { Interest } from './entities/interest.entity';

@ApiBearerAuth()
@Controller('interests')
export class InterestController {
  constructor(private readonly interestService: InterestService) {}

  @ApiResponse({ type: [Interest] })
  @Get()
  getInterests() {
    return this.interestService.getInterests();
  }
}
