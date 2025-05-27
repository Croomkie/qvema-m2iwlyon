import { ApiProperty } from '@nestjs/swagger';
import { Investment } from '../../investments/entities/investment.entity';
import { UserDto } from '../../users/dto/user.dto';
import { Expose, Type } from 'class-transformer';

export class ProjectDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  title: string;

  @ApiProperty()
  @Expose()
  description: string;

  @ApiProperty()
  @Expose()
  budget: number;

  @ApiProperty()
  @Expose()
  category: string;

  @ApiProperty()
  @Expose()
  @Type(() => UserDto)
  owner: UserDto;
}
