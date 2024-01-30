import { Test, TestingModule } from '@nestjs/testing';
import { ContactsService } from './contacts.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Contact as ContactEntity } from './entities/contact.entity';
import { ContactId } from './types';
import {
  CONTACT_ENTITY_FULL,
  CONTACT_FULL,
  CONTACT_FULL_WITH_ID,
  CONTACT_MINIMAL,
  UPDATED_CONTACT_ENTITY_FULL,
  UPDATED_CONTACT_FULL,
} from './contact-mock';
import { ILike } from 'typeorm';

describe('Contacts service', () => {
  let service: ContactsService;
  const repositoryMock = {
    save: jest.fn(),
    findOneBy: jest.fn(),
    delete: jest.fn(),
    findBy: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContactsService,
        {
          provide: getRepositoryToken(ContactEntity),
          useValue: repositoryMock,
        },
      ],
    }).compile();

    service = module.get(ContactsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('creates contact', async () => {
    const id = 1;
    const expected = {
      id,
      ...CONTACT_FULL,
    };
    repositoryMock.save.mockImplementation(() => CONTACT_ENTITY_FULL);

    const result = await service.createContact(CONTACT_FULL);

    expect(result).toEqual(expected);
  });

  it('creates minimal contact', async () => {
    const id = 2;
    const expected = {
      id,
      ...CONTACT_MINIMAL,
    };
    repositoryMock.save.mockImplementation((contact) => ({
      id,
      name: contact.name,
    }));

    const result = await service.createContact(CONTACT_MINIMAL);

    expect(result).toEqual(expected);
  });

  it('finds contact', async () => {
    const id = 1;
    const expected = {
      id,
      ...CONTACT_FULL,
    };
    const mock = repositoryMock.findOneBy.mockImplementation(
      () => CONTACT_ENTITY_FULL,
    );

    const result = await service.findContact(id as ContactId);

    expect(result).toEqual(expected);
    expect(mock).toHaveBeenCalledWith({ id: 1 });
  });

  it('fails to find contact', async () => {
    const mock = repositoryMock.findOneBy.mockImplementation(() => null);

    const result = await service.findContact(1 as ContactId);

    expect(result).toBeNull();
    expect(mock).toHaveBeenCalledWith({ id: 1 });
  });

  it('updates contact', async () => {
    repositoryMock.save.mockImplementation(() => UPDATED_CONTACT_ENTITY_FULL);

    const result = await service.updateContact(1 as ContactId, {
      email: 'pablolopez@gmail.com',
    });

    expect(result).toEqual(UPDATED_CONTACT_FULL);
  });

  it('deletes contact', async () => {
    const id = 1 as ContactId;
    const mock = repositoryMock.delete.mockImplementation(() => ({
      affected: 1,
    }));

    const result = await service.deleteContact(id);

    expect(result).toBe(true);
    expect(mock).toHaveBeenCalledWith(id);
  });

  it('fails to delete contact', async () => {
    const id = 2 as ContactId;
    const mock = repositoryMock.delete.mockImplementation(() => ({
      affected: 0,
    }));

    const result = await service.deleteContact(id);

    expect(result).toBe(false);
    expect(mock).toHaveBeenCalledWith(id);
  });

  it('finds contact by email', async () => {
    const email = 'pablolopez@ln.com';
    const mock = repositoryMock.findBy.mockImplementation(() => [
      CONTACT_ENTITY_FULL,
    ]);

    const result = await service.findContactsByEmail(email);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual(CONTACT_FULL_WITH_ID);
    expect(mock).toHaveBeenCalledWith({ email });
  });

  it('finds contact by phone', async () => {
    const phone = '+54 9 11 4522 1551';
    const mock = repositoryMock.findBy.mockImplementation(() => [
      CONTACT_ENTITY_FULL,
    ]);

    const result = await service.findContactsByPhone(phone);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual(CONTACT_FULL_WITH_ID);
    expect(mock).toHaveBeenCalledWith({ phones: { phone } });
  });

  it('finds contacts by city', async () => {
    const mock = repositoryMock.findBy.mockImplementation(() => [
      CONTACT_ENTITY_FULL,
    ]);

    const result = await service.findContactsByCity('CABA');

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual(CONTACT_FULL_WITH_ID);
    expect(mock).toHaveBeenCalledWith({ address: { city: ILike('CABA') } });
  });

  it('finds contacts by state', async () => {
    const mock = repositoryMock.findBy.mockImplementation(() => [
      CONTACT_ENTITY_FULL,
    ]);

    const result = await service.findContactsByState('CABA');

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual(CONTACT_FULL_WITH_ID);
    expect(mock).toHaveBeenCalledWith({ address: { state: ILike('CABA') } });
  });
});
