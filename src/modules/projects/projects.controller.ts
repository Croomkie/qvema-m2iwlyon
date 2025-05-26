import { Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Role } from '../users/enum/role';
import { Roles } from '../auth/roles.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('projects')
export class ProjectsController {
  @UseGuards(AuthGuard, RolesGuard)
  @Post()
  @Roles(Role.entrepreneur)
  async addProject() {}

  @UseGuards(AuthGuard)
  @Get()
  async getAllProject() {}

  @UseGuards(AuthGuard)
  @Get(':id')
  async getProject(@Param('id') id: string) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Put(':id')
  @Roles(Role.entrepreneur)
  async updateProject(@Param('id') id: string) {
    //TODO: L'entrepreneur peut modifier son projet mais uniquement les siens.
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Delete(':id')
  @Roles(Role.entrepreneur, Role.admin)
  async deleteProject(@Param('id') id: string) {
    //TODO: L'entrepreneur peut modifier son projet mais uniquement les siens.
  }

  @UseGuards(AuthGuard)
  @Get('recommended')
  async getRecommendation(@Req() req: any) {
    // return await this.projectService.getRecommendation(req.user.sub);
  }
}
