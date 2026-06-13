import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { ExpenseCategory } from '../../common/enums/expense-category.enum';

export enum ExpenseSortOrder {
  NEWEST = 'newest',
  OLDEST = 'oldest',
  AMOUNT_DESC = 'amount_desc',
  AMOUNT_ASC = 'amount_asc',
}

export class ListExpensesQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ enum: ExpenseCategory })
  @IsOptional()
  @IsEnum(ExpenseCategory)
  category?: ExpenseCategory;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  memberId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({ enum: ExpenseSortOrder, default: ExpenseSortOrder.NEWEST })
  @IsOptional()
  @IsEnum(ExpenseSortOrder)
  sort?: ExpenseSortOrder;
}
