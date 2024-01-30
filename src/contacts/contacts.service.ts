import { Injectable } from '@nestjs/common';
import { Contact, ContactId, ContactWithId } from './types';
import { Contact as ContactEntity } from './entities/contact.entity';
import { ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  mapContact,
  mapContactEntities,
  mapContactEntity,
} from './entities/mappers';

@Injectable()
export class ContactsService {
  constructor(
    @InjectRepository(ContactEntity)
    private contactsRepository: Repository<ContactEntity>,
  ) {}

  async createContact(contact: Contact): Promise<ContactWithId> {
    const entity = await this.contactsRepository.save(mapContact(contact));
    return mapContactEntity(entity);
  }

  async findContact(id: ContactId): Promise<ContactWithId | null> {
    const contact = await this.contactsRepository.findOneBy({ id });
    return contact !== null ? mapContactEntity(contact) : null;
  }

  async updateContact(
    id: ContactId,
    contact: Partial<Contact>,
  ): Promise<ContactWithId> {
    const updated = await this.contactsRepository.save(mapContact(contact, id));
    return mapContactEntity(updated);
  }

  async deleteContact(id: ContactId): Promise<boolean> {
    const { affected } = await this.contactsRepository.delete(id);
    return affected === 1;
  }

  async findContactsByEmail(email: string): Promise<ContactWithId[]> {
    const contacts = await this.contactsRepository.findBy({ email });
    return mapContactEntities(contacts);
  }

  async findContactsByPhone(phone: string): Promise<ContactWithId[]> {
    const contacts = await this.contactsRepository.findBy({
      phones: { phone },
    });
    return mapContactEntities(contacts);
  }

  async findContactsByState(state: string): Promise<ContactWithId[]> {
    const contacts = await this.contactsRepository.findBy({
      address: { state: ILike(state) },
    });
    return mapContactEntities(contacts);
  }

  async findContactsByCity(city: string): Promise<ContactWithId[]> {
    const contacts = await this.contactsRepository.findBy({
      address: { city: ILike(city) },
    });
    return mapContactEntities(contacts);
  }

  async findAll(): Promise<ContactWithId[]> {
    const contacts = await this.contactsRepository.find();
    return mapContactEntities(contacts);
  }
}
