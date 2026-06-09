import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { TripAccessGuard } from '../common/guards/trip-access.guard';
import { User } from '../users/entities/user.entity';
import { SettleDto } from './dto/settle.dto';
import { SettlementsService } from './settlements.service';

@ApiTags('settlements')
@ApiBearerAuth()
@Controller('trips/:id')
@UseGuards(TripAccessGuard)
export class SettlementsController {
  constructor(private readonly settlementsService: SettlementsService) {}

  @Get('balances')
  getBalances(@Param('id') tripId: string, @CurrentUser() user: User) {
    return this.settlementsService.getBalances(tripId, user.id);
  }

  @Get('settlements')
  getSettlements(@Param('id') tripId: string, @CurrentUser() user: User) {
    return this.settlementsService.getSuggestedSettlements(tripId, user.id);
  }

  @Post('settlements/settle')
  settle(
    @Param('id') tripId: string,
    @CurrentUser() user: User,
    @Body() dto: SettleDto,
  ) {
    return this.settlementsService.settle(tripId, user.id, dto);
  }
}
