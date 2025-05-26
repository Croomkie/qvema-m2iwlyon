import { Module } from '@nestjs/common';
import { InvestmentsController } from './investments.controller';
import { InvestmentsService } from './investments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Interest } from '../interest/entities/interest.entity';
import { Investment } from './entities/investment.entity';
import { User } from '../users/entities/user.entity';
import { Project } from '../projects/entities/project.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Investment, User, Project])],
  controllers: [InvestmentsController],
  providers: [InvestmentsService],
})
export class InvestmentsModule {}
