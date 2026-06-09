import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { TripAccessGuard } from '../common/guards/trip-access.guard';
import { User } from '../users/entities/user.entity';
import { BudgetsService } from './budgets.service';
import { UpdateBudgetDto } from './dto/update-budget.dto';

@ApiTags('budgets')
@ApiBearerAuth()
@Controller('trips/:id')
@UseGuards(TripAccessGuard)
export class BudgetsController {
  constructor(private readonly budgetsService: BudgetsService) {}

  @Get('budget')
  getBudget(@Param('id') tripId: string, @CurrentUser() user: User) {
    return this.budgetsService.getBudget(tripId, user.id);
  }

  @Put('budget')
  updateBudget(
    @Param('id') tripId: string,
    @CurrentUser() user: User,
    @Body() dto: UpdateBudgetDto,
  ) {
    return this.budgetsService.updateBudget(tripId, user.id, dto);
  }

  @Get('summary')
  getSummary(@Param('id') tripId: string, @CurrentUser() user: User) {
    return this.budgetsService.getSummary(tripId, user.id);
  }
}
