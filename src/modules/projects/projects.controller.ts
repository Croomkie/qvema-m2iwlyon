import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';

@Controller('projects')
export class ProjectsController {

  @UseGuards(AuthGuard)
  @Get('recommended')
  async getRecommendation(@Req() req: any) {
    // return await this.projectService.getRecommendation(req.user.sub);
  }
}
