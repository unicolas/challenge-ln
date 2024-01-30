import { Test, TestingModule } from '@nestjs/testing';
import { ContactsController } from './contacts.controller';
import { ContactsService } from './contacts.service';
import {
  CONTACT_FULL,
  CONTACT_FULL_DTO,
  CONTACT_FULL_WITH_ID,
  CREATE_CONTACT_DTO,
  UPDATED_CONTACT_FULL,
  UPDATED_CONTACT_FULL_DTO,
} from './contact-mock';
import { HttpException } from '@nestjs/common';

describe('Contacts controller', () => {
  let controller: ContactsController;
  const serviceMock = {
    findContact: jest.fn(),
    createContact: jest.fn(),
    updateContact: jest.fn(),
    deleteContact: jest.fn(),
    findContactsByEmail: jest.fn(),
    findContactsByPhone: jest.fn(),
    findContactsByState: jest.fn(),
    findContactsByCity: jest.fn(),
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContactsController],
      providers: [
        ContactsService,
        {
          provide: ContactsService,
          useValue: serviceMock,
        },
      ],
    }).compile();

    controller = module.get(ContactsController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('finds contact', async () => {
    const id = 1;
    const mock = serviceMock.findContact.mockImplementation(
      () => CONTACT_FULL_WITH_ID,
    );

    const result = await controller.findContact(id);

    expect(result).toEqual(CONTACT_FULL_DTO);
    expect(mock).toHaveBeenCalledWith(id);
  });

  it('throws error when contact is not found', async () => {
    const id = 1;
    const mock = serviceMock.findContact.mockImplementation(() => null);

    await expect(controller.findContact(id)).rejects.toThrow(HttpException);
    expect(mock).toHaveBeenCalledWith(id);
  });

  it('creates contact', async () => {
    const mock = serviceMock.createContact.mockImplementation(
      () => CONTACT_FULL_WITH_ID,
    );

    const result = await controller.createContact(CREATE_CONTACT_DTO);

    expect(result).toEqual(CONTACT_FULL_DTO);
    expect(mock).toHaveBeenCalledWith(CONTACT_FULL);
  });

  it('updates contact', async () => {
    const id = 1;
    const findMock = serviceMock.findContact.mockImplementation(
      () => CONTACT_FULL_WITH_ID,
    );
    const updateMock = serviceMock.updateContact.mockImplementation(
      () => UPDATED_CONTACT_FULL,
    );

    const result = await controller.updateContact(id, {
      email: 'pablolopez@gmail.com',
    });

    expect(result).toEqual(UPDATED_CONTACT_FULL_DTO);
    expect(findMock).toHaveBeenCalledWith(id);
    expect(updateMock).toHaveBeenCalledWith(id, {
      email: 'pablolopez@gmail.com',
    });
  });

  it('fails to update if contact is not found', async () => {
    const id = 2;
    const findMock = serviceMock.findContact.mockImplementation(() => null);
    const updateMock = serviceMock.updateContact.mockImplementation();

    await expect(
      controller.updateContact(id, {
        email: 'pablolopez@gmail.com',
      }),
    ).rejects.toThrow(HttpException);
    expect(findMock).toHaveBeenCalledWith(id);
    expect(updateMock).not.toHaveBeenCalled();
  });

  it('deletes contact', async () => {
    const mock = serviceMock.deleteContact.mockImplementation(() => true);

    await controller.removeContact(1);

    expect(mock).toHaveBeenCalledWith(1);
  });

  it('fails to delete contact if does not exist', async () => {
    const mock = serviceMock.deleteContact.mockImplementation(() => false);

    await expect(controller.removeContact(1)).rejects.toThrow(HttpException);
    expect(mock).toHaveBeenCalledWith(1);
  });

  it('filters by email', async () => {
    const email = 'pablolopez@gmail.com';
    const mock = serviceMock.findContactsByEmail.mockImplementation(() => [
      CONTACT_FULL_WITH_ID,
    ]);

    await controller.filterContacts(email);

    expect(mock).toHaveBeenCalledWith(email);
  });

  it('filters by phone', async () => {
    const phone = '+54 9 11 4522 1551';
    const mock = serviceMock.findContactsByPhone.mockImplementation(() => [
      CONTACT_FULL_WITH_ID,
    ]);

    await controller.filterContacts(undefined, phone);

    expect(mock).toHaveBeenCalledWith(phone);
  });

  it('filters by city', async () => {
    const city = 'CABA';
    const mock = serviceMock.findContactsByCity.mockImplementation(() => [
      CONTACT_FULL_WITH_ID,
    ]);

    await controller.filterContacts(undefined, undefined, city);

    expect(mock).toHaveBeenCalledWith(city);
  });

  it('filters by state', async () => {
    const state = 'CABA';
    const mock = serviceMock.findContactsByState.mockImplementation(() => [
      CONTACT_FULL_WITH_ID,
    ]);

    await controller.filterContacts(undefined, undefined, undefined, state);

    expect(mock).toHaveBeenCalledWith(state);
  });

  it('returns all if not filters are given', async () => {
    const mock = serviceMock.findAll.mockImplementation(() => [
      CONTACT_FULL_WITH_ID,
    ]);

    await controller.filterContacts();

    expect(mock).toHaveBeenCalled();
  });

  it('fails to filter if multiple filters are given', async () => {
    await expect(
      controller.filterContacts(undefined, undefined, 'CABA', 'CABA'),
    ).rejects.toThrow(HttpException);
  });
});
