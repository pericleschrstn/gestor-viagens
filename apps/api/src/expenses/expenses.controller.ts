import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { TripAccessGuard } from '../common/guards/trip-access.guard';
import { User } from '../users/entities/user.entity';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { ListExpensesQueryDto } from './dto/list-expenses-query.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { ExpensesService } from './expenses.service';

@ApiTags('expenses')
@ApiBearerAuth()
@Controller()
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @UseGuards(TripAccessGuard)
  @Get('trips/:id/expenses')
  findAll(
    @Param('id') tripId: string,
    @CurrentUser() user: User,
    @Query() query: ListExpensesQueryDto,
  ) {
    return this.expensesService.findAllByTrip(tripId, user.id, query);
  }

  @UseGuards(TripAccessGuard)
  @Post('trips/:id/expenses')
  create(
    @Param('id') tripId: string,
    @CurrentUser() user: User,
    @Body() dto: CreateExpenseDto,
  ) {
    return this.expensesService.create(tripId, user.id, dto);
  }

  @Get('expenses/:id')
  findOne(@Param('id') expenseId: string, @CurrentUser() user: User) {
    return this.expensesService.findOneForOwner(expenseId, user.id);
  }

  @Patch('expenses/:id')
  update(
    @Param('id') expenseId: string,
    @CurrentUser() user: User,
    @Body() dto: UpdateExpenseDto,
  ) {
    return this.expensesService.update(expenseId, user.id, dto);
  }

  @Delete('expenses/:id')
  remove(@Param('id') expenseId: string, @CurrentUser() user: User) {
    return this.expensesService.remove(expenseId, user.id);
  }
}
