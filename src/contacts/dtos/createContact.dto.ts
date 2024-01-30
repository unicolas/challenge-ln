import { OmitType } from '@nestjs/swagger';
import { ContactDto } from './contact.dto';

export class CreateContactDto extends OmitType(ContactDto, ['id'] as const) {}
