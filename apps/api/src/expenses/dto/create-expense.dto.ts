import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsEnum,
  IsNumberString,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Currency } from '../../common/enums/currency.enum';
import { ExpenseCategory } from '../../common/enums/expense-category.enum';
import { ExpenseSplitDto } from './expense-split.dto';

export class CreateExpenseDto {
  @ApiProperty({ example: 'Jantar na trattoria' })
  @IsString()
  @MinLength(1)
  description!: string;

  @ApiProperty({ example: '120.50' })
  @IsNumberString()
  amount!: string;

  @ApiProperty({ enum: Currency, example: Currency.ARS })
  @IsEnum(Currency)
  currency!: Currency;

  @ApiProperty({ example: '2026-06-14' })
  @IsDateString()
  date!: string;

  @ApiProperty({ enum: ExpenseCategory })
  @IsEnum(ExpenseCategory)
  category!: ExpenseCategory;

  @ApiProperty()
  @IsUUID()
  payerId!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  receiptUrl?: string;

  @ApiProperty({ type: [ExpenseSplitDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ExpenseSplitDto)
  splits!: ExpenseSplitDto[];
}
