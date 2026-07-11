import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { RequireTripPermission } from '../common/decorators/require-trip-permission.decorator';
import { TripPermission } from '../common/enums/trip-permission.enum';
import { TripRbacGuard } from '../common/guards/trip-rbac.guard';
import { TripRbacService } from '../common/rbac/trip-rbac.service';
import { User } from '../users/entities/user.entity';
import { CreateTripDto } from './dto/create-trip.dto';
import { TripAccessDto } from './dto/trip-access.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { TripsService } from './trips.service';

@ApiTags('trips')
@ApiBearerAuth()
@Controller('trips')
export class TripsController {
  constructor(
    private readonly tripsService: TripsService,
    private readonly tripRbacService: TripRbacService,
  ) {}

  @Get()
  findAll(@CurrentUser() user: User) {
    return this.tripsService.findAllAccessible(user.id);
  }

  @Post()
  create(@CurrentUser() user: User, @Body() dto: CreateTripDto) {
    return this.tripsService.create(user, dto);
  }

  @UseGuards(TripRbacGuard)
  @RequireTripPermission(TripPermission.READ)
  @Get(':id/access')
  @ApiOkResponse({ type: TripAccessDto })
  getAccess(@Param('id') id: string, @CurrentUser() user: User) {
    return this.tripRbacService.getAccess(user.id, id);
  }

  @UseGuards(TripRbacGuard)
  @RequireTripPermission(TripPermission.READ)
  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: User) {
    return this.tripsService.findOneAccessible(id, user.id);
  }

  @UseGuards(TripRbacGuard)
  @RequireTripPermission(TripPermission.DELETE_TRIP)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @CurrentUser() user: User,
    @Body() dto: UpdateTripDto,
  ) {
    return this.tripsService.update(id, user.id, dto);
  }

  @UseGuards(TripRbacGuard)
  @RequireTripPermission(TripPermission.DELETE_TRIP)
  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.tripsService.remove(id, user.id);
  }
}
