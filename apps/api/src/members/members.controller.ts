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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { TripAccessGuard } from '../common/guards/trip-access.guard';
import { User } from '../users/entities/user.entity';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { MembersService } from './members.service';

@ApiTags('members')
@ApiBearerAuth()
@Controller()
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @UseGuards(TripAccessGuard)
  @Get('trips/:id/members')
  findAll(@Param('id') tripId: string, @CurrentUser() user: User) {
    return this.membersService.findAllByTrip(tripId, user.id);
  }

  @UseGuards(TripAccessGuard)
  @Post('trips/:id/members')
  create(
    @Param('id') tripId: string,
    @CurrentUser() user: User,
    @Body() dto: CreateMemberDto,
  ) {
    return this.membersService.create(tripId, user.id, dto);
  }

  @Patch('members/:id')
  update(
    @Param('id') memberId: string,
    @CurrentUser() user: User,
    @Body() dto: UpdateMemberDto,
  ) {
    return this.membersService.update(memberId, user.id, dto);
  }

  @Delete('members/:id')
  remove(@Param('id') memberId: string, @CurrentUser() user: User) {
    return this.membersService.remove(memberId, user.id);
  }
}
