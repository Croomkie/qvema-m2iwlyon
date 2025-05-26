import { Module } from '@nestjs/common';
import { InterestController } from './interest.controller';
import { InterestService } from './interest.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Interest } from './entities/interest.entity';
import { ProjectsController } from './projects/projects.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Interest])],
  controllers: [InterestController, ProjectsController],
  providers: [InterestService]
})
export class InterestModule {}
