import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNumberString,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { ExpenseCategory } from '../../common/enums/expense-category.enum';

export class CategoryBudgetItemDto {
  @ApiProperty({ enum: ExpenseCategory })
  @IsEnum(ExpenseCategory)
  category!: ExpenseCategory;

  @ApiProperty({ example: '3000.00' })
  @IsNumberString()
  limitAmount!: string;
}

export class UpdateBudgetDto {
  @ApiPropertyOptional({ example: '15000.00' })
  @IsOptional()
  @IsNumberString()
  totalBudget?: string;

  @ApiProperty({ type: [CategoryBudgetItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CategoryBudgetItemDto)
  categories!: CategoryBudgetItemDto[];
}
