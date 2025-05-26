import { ApiProperty } from '@nestjs/swagger';

export class CreateInvestmentDto {
  @ApiProperty()
  investorId: string;

  @ApiProperty()
  projectId: string;

  @ApiProperty()
  amount: number;
}
