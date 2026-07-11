import { ApiProperty } from '@nestjs/swagger';
import { TripMemberRole } from '../../common/enums/trip-member-role.enum';
import { TripPermission } from '../../common/enums/trip-permission.enum';

export class TripAccessDto {
  @ApiProperty({ enum: TripMemberRole })
  role!: TripMemberRole;

  @ApiProperty({ enum: TripPermission, isArray: true })
  permissions!: TripPermission[];
}
