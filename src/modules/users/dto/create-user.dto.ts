import { IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @MinLength(6)
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @IsOptional()
  name?: string;

  @ApiProperty()
  role: number;
}
