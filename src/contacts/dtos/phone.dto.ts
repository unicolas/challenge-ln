import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsPhoneNumber, MaxLength } from 'class-validator';
import { MAX_PHONE_LENGTH } from '../constants';

export class PhoneDto {
  @ApiProperty()
  @IsPhoneNumber()
  @MaxLength(MAX_PHONE_LENGTH)
  work: string;

  @ApiProperty()
  @MaxLength(MAX_PHONE_LENGTH)
  @IsPhoneNumber()
  personal: string;
}

export class WorkPhoneDto extends PickType(PhoneDto, ['work'] as const) {}

export class PersonalPhoneDto extends PickType(PhoneDto, [
  'personal',
] as const) {}
