import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNumberString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

export class SettlementItemDto {
  @ApiProperty()
  @IsUUID()
  fromMemberId!: string;

  @ApiProperty()
  @IsUUID()
  toMemberId!: string;

  @ApiProperty({ example: '150.00' })
  @IsNumberString()
  amount!: string;
}

export class SettleDto {
  @ApiProperty({ type: [SettlementItemDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => SettlementItemDto)
  settlements!: SettlementItemDto[];
}
