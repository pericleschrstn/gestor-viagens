import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNumberString,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Currency } from '../../common/enums/currency.enum';
import { TripStatus } from '../../common/enums/trip-status.enum';

export class CreateTripDto {
  @ApiProperty({ example: 'Itália em família' })
  @IsString()
  @MinLength(2)
  name!: string;

  @ApiProperty({ example: 'IT' })
  @IsString()
  @MinLength(1)
  @MaxLength(4)
  initials!: string;

  @ApiProperty({ example: '2026-06-10' })
  @IsDateString()
  startDate!: string;

  @ApiProperty({ example: '2026-06-22' })
  @IsDateString()
  endDate!: string;

  @ApiPropertyOptional({ enum: TripStatus, default: TripStatus.PLANNING })
  @IsOptional()
  @IsEnum(TripStatus)
  status?: TripStatus;

  @ApiPropertyOptional({ enum: Currency, default: Currency.BRL })
  @IsOptional()
  @IsEnum(Currency)
  baseCurrency?: Currency;

  @ApiPropertyOptional({ example: '15000.00' })
  @IsOptional()
  @IsNumberString()
  totalBudget?: string;
}
