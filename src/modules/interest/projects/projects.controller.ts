import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '../../auth/auth.guard';
import { InterestService } from '../interest.service';

@ApiBearerAuth()
@Controller('projects')
export class ProjectsController {
  constructor(private interestService: InterestService) {}

  @UseGuards(AuthGuard)
  @Get('recommended')
  async getRecommendation(@Req() req: any) {
    return await this.interestService.getRecommendation(req.user.sub);
  }
}
