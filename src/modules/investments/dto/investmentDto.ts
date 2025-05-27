import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ProjectDto } from '../../projects/dto/projectDto';

export class InvestmentDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  amount: number;

  @ApiProperty()
  @Expose()
  date: Date;

  @ApiProperty()
  @Expose()
  @Type(() => ProjectDto)
  project: ProjectDto;
}
