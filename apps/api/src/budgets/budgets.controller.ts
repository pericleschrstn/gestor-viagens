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
import { RequireTripPermission } from '../common/decorators/require-trip-permission.decorator';
import { TripPermission } from '../common/enums/trip-permission.enum';
import { TripRbacGuard } from '../common/guards/trip-rbac.guard';
import { User } from '../users/entities/user.entity';
import { BudgetsService } from './budgets.service';
import { UpdateBudgetDto } from './dto/update-budget.dto';

@ApiTags('budgets')
@ApiBearerAuth()
@Controller('trips/:id')
export class BudgetsController {
  constructor(private readonly budgetsService: BudgetsService) {}

  @UseGuards(TripRbacGuard)
  @RequireTripPermission(TripPermission.READ)
  @Get('budget')
  getBudget(@Param('id') tripId: string, @CurrentUser() user: User) {
    return this.budgetsService.getBudget(tripId, user.id);
  }

  @UseGuards(TripRbacGuard)
  @RequireTripPermission(TripPermission.MANAGE_BUDGET)
  @Put('budget')
  updateBudget(
    @Param('id') tripId: string,
    @CurrentUser() user: User,
    @Body() dto: UpdateBudgetDto,
  ) {
    return this.budgetsService.updateBudget(tripId, user.id, dto);
  }

  @UseGuards(TripRbacGuard)
  @RequireTripPermission(TripPermission.READ)
  @Get('summary')
  getSummary(@Param('id') tripId: string, @CurrentUser() user: User) {
    return this.budgetsService.getSummary(tripId, user.id);
  }
}
