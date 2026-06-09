import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsUUID } from 'class-validator';

export class ExpenseSplitDto {
  @ApiProperty()
  @IsUUID()
  memberId!: string;

  @ApiProperty({ example: '50.00' })
  @IsNumberString()
  share!: string;
}
