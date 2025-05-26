import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Role } from '../users/enum/role';
import { Roles } from '../auth/roles.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@ApiBearerAuth()
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectService: ProjectsService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Post()
  @Roles(Role.entrepreneur)
  async addProject(@Req() req: any, @Body() dto: CreateProjectDto) {
    return this.projectService.create(dto, req.user.id);
  }

  @UseGuards(AuthGuard)
  @Get()
  async getAllProject() {
    return this.projectService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async getProject(@Param('id') id: string) {
    return this.projectService.findById(id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Put(':id')
  @Roles(Role.entrepreneur)
  async updateProject(
    @Param('id') id: string,
    @Req() req: any,
    @Body() dto: UpdateProjectDto,
  ) {
    return this.projectService.update(id, dto, req.user);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Delete(':id')
  @Roles(Role.entrepreneur, Role.admin)
  async deleteProject(@Param('id') id: string, @Req() req: any) {
    return this.projectService.delete(id, req.user);
  }

  @UseGuards(AuthGuard)
  @Get('recommended')
  async getRecommendation(@Req() req: any) {
    return await this.projectService.getRecommendations(req.user.sub);
  }
}
