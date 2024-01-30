import { Type } from 'class-transformer';
import {
  MaxLength,
  IsEmail,
  IsOptional,
  ValidateNested,
  IsDateString,
} from 'class-validator';
import { PersonalPhoneDto, PhoneDto, WorkPhoneDto } from './phone.dto';
import { AddressDto } from './address.dto';
import {
  MAX_COMPANY_LENGTH,
  MAX_EMAIL_LENGTH,
  MAX_NAME_LENGTH,
} from '../constants';
import {
  ApiProperty,
  ApiPropertyOptional,
  getSchemaPath,
} from '@nestjs/swagger';

export class ContactDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  @MaxLength(MAX_NAME_LENGTH)
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @MaxLength(MAX_COMPANY_LENGTH)
  company?: string;

  @ApiPropertyOptional()
  @IsOptional()
  profile_image?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  @MaxLength(MAX_EMAIL_LENGTH)
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  birthdate?: Date;

  @ApiPropertyOptional({
    oneOf: [
      { $ref: getSchemaPath(PhoneDto) },
      { $ref: getSchemaPath(WorkPhoneDto) },
      { $ref: getSchemaPath(PersonalPhoneDto) },
    ],
  })
  @IsOptional()
  @ValidateNested()
  @Type((type) =>
    type?.object.phone_number.work
      ? type?.object.phone_number.personal
        ? PhoneDto
        : WorkPhoneDto
      : PersonalPhoneDto,
  )
  phone_number?: PhoneDto | WorkPhoneDto | PersonalPhoneDto;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => AddressDto)
  address?: AddressDto;
}
