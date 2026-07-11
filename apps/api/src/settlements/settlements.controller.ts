import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { RequireTripPermission } from '../common/decorators/require-trip-permission.decorator';
import { TripPermission } from '../common/enums/trip-permission.enum';
import { TripRbacGuard } from '../common/guards/trip-rbac.guard';
import { User } from '../users/entities/user.entity';
import { SettleDto } from './dto/settle.dto';
import { SettlementsService } from './settlements.service';

@ApiTags('settlements')
@ApiBearerAuth()
@Controller('trips/:id')
export class SettlementsController {
  constructor(private readonly settlementsService: SettlementsService) {}

  @UseGuards(TripRbacGuard)
  @RequireTripPermission(TripPermission.READ)
  @Get('balances')
  getBalances(@Param('id') tripId: string, @CurrentUser() user: User) {
    return this.settlementsService.getBalances(tripId, user.id);
  }

  @UseGuards(TripRbacGuard)
  @RequireTripPermission(TripPermission.READ)
  @Get('settlements')
  getSettlements(@Param('id') tripId: string, @CurrentUser() user: User) {
    return this.settlementsService.getSuggestedSettlements(tripId, user.id);
  }

  @UseGuards(TripRbacGuard)
  @RequireTripPermission(TripPermission.MANAGE_SETTLEMENTS)
  @Post('settlements/settle')
  settle(
    @Param('id') tripId: string,
    @CurrentUser() user: User,
    @Body() dto: SettleDto,
  ) {
    return this.settlementsService.settle(tripId, user.id, dto);
  }
}
