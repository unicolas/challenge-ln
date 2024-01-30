import { IsOptional, MaxLength } from 'class-validator';
import {
  MAX_ADDRESS_LINE1_LENGTH,
  MAX_ADDRESS_LINE2_LENGTH,
  MAX_CITY_LENGTH,
  MAX_STATE_LENGTH,
} from '../constants';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AddressDto {
  @ApiProperty()
  @MaxLength(MAX_ADDRESS_LINE1_LENGTH)
  line1: string;

  @ApiPropertyOptional()
  @IsOptional()
  @MaxLength(MAX_ADDRESS_LINE2_LENGTH)
  line2?: string;

  @ApiProperty()
  @MaxLength(MAX_CITY_LENGTH)
  city: string;

  @ApiProperty()
  @MaxLength(MAX_STATE_LENGTH)
  state: string;
}
