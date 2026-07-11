import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import { TripMemberRole } from '../../common/enums/trip-member-role.enum';

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

  @ApiPropertyOptional({ enum: TripMemberRole, default: TripMemberRole.EDITOR })
  @IsOptional()
  @IsEnum(TripMemberRole)
  role?: TripMemberRole;
}
