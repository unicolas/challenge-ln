import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Patch,
  Delete,
  HttpCode,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { ContactId, ContactWithId } from './types';
import { CreateContactDto } from './dtos/createContact.dto';
import {
  mapCreateContactDto,
  mapContactWithId,
  mapUpdateContactDto,
} from './dtos/mappers';
import { ContactDto } from './dtos/contact.dto';
import { UpdateContactDto } from './dtos/updateContact.dto';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('contacts')
@ApiTags('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a contact' })
  @ApiResponse({ status: 200, description: 'Contact', type: ContactDto })
  @ApiResponse({ status: 404, description: 'Contact not found' })
  async findContact(
    @Param('id', ParseIntPipe) contactId: number,
  ): Promise<ContactDto> {
    const contact = await this.contactsService.findContact(
      contactId as ContactId,
    );
    if (!contact) {
      throw new HttpException('Contact not found', HttpStatus.NOT_FOUND);
    }
    return mapContactWithId(contact);
  }

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Create a contact' })
  @ApiResponse({ status: 201, description: 'New contact', type: ContactDto })
  async createContact(
    @Body() createContactDto: CreateContactDto,
  ): Promise<ContactDto> {
    const contact = await this.contactsService.createContact(
      mapCreateContactDto(createContactDto),
    );
    return mapContactWithId(contact);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a contact' })
  @ApiResponse({
    status: 200,
    description: 'Updated contact',
    type: ContactDto,
  })
  @ApiResponse({ status: 404, description: 'Contact not found' })
  async updateContact(
    @Param('id', ParseIntPipe) contactId: number,
    @Body() updateContactDto: UpdateContactDto,
  ): Promise<ContactDto> {
    const found = await this.contactsService.findContact(
      contactId as ContactId,
    );
    if (!found) {
      throw new HttpException('Contact not found', HttpStatus.NOT_FOUND);
    }
    const contact = await this.contactsService.updateContact(
      contactId as ContactId,
      mapUpdateContactDto(updateContactDto),
    );
    return mapContactWithId(contact);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete a contact' })
  @ApiResponse({ status: 204, description: 'Contact deleted' })
  @ApiResponse({ status: 404, description: 'Contact not found' })
  async removeContact(
    @Param('id', ParseIntPipe) contactId: number,
  ): Promise<void> {
    const deleted = await this.contactsService.deleteContact(
      contactId as ContactId,
    );
    if (!deleted) {
      throw new HttpException('Contact not found', HttpStatus.NOT_FOUND);
    }
  }

  @Get()
  @ApiOperation({ summary: 'Filter contacts' })
  @ApiResponse({ status: 200, description: 'Contacts', type: [ContactDto] })
  @ApiResponse({ status: 422, description: 'Multiple filters not allowed' })
  @ApiQuery({ name: 'email', required: false, description: 'Filter by email' })
  @ApiQuery({ name: 'phone', required: false, description: 'Filter by phone' })
  @ApiQuery({ name: 'city', required: false, description: 'Filter by city' })
  @ApiQuery({ name: 'state', required: false, description: 'Filter by state' })
  async filterContacts(
    @Query('email') email?: string,
    @Query('phone') phone?: string,
    @Query('city') city?: string,
    @Query('state') state?: string,
  ): Promise<ContactDto[]> {
    if ([email, phone, city, state].filter((each) => each).length > 1) {
      throw new HttpException(
        'Multiple filters are not supported',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    let contacts: ContactWithId[] = [];
    if (email) {
      contacts = await this.contactsService.findContactsByEmail(email);
    } else if (phone) {
      contacts = await this.contactsService.findContactsByPhone(phone);
    } else if (city) {
      contacts = await this.contactsService.findContactsByCity(city);
    } else if (state) {
      contacts = await this.contactsService.findContactsByState(state);
    } else {
      contacts = await this.contactsService.findAll();
    }
    return contacts.map((contact) => mapContactWithId(contact));
  }
}
