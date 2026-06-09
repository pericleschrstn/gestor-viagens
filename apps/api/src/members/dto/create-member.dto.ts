import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateMemberDto {
  @ApiProperty({ example: 'Ana' })
  @IsString()
  @MinLength(1)
  name!: string;

  @ApiProperty({ example: 'AN' })
  @IsString()
  @MinLength(1)
  @MaxLength(4)
  initials!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  userId?: string;
}
