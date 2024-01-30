import { Contact, ContactWithId } from '../types';
import { ContactDto } from './contact.dto';
import { CreateContactDto } from './createContact.dto';
import { UpdateContactDto } from './updateContact.dto';

export function mapCreateContactDto(dto: CreateContactDto): Contact {
  const {
    name,
    company,
    profile_image: profileImage,
    email,
    birthdate,
    phone_number: phoneNumber,
    address,
  } = dto;
  return {
    name,
    company,
    profileImage,
    email,
    birthdate,
    phoneNumber,
    address,
  };
}

export function mapContactWithId(contact: ContactWithId): ContactDto {
  const {
    id,
    name,
    company,
    profileImage: profile_image,
    email,
    birthdate,
    phoneNumber: phone_number,
    address,
  } = contact;
  return {
    id,
    name,
    company,
    profile_image,
    email,
    birthdate,
    phone_number,
    address,
  };
}

export function mapUpdateContactDto(dto: UpdateContactDto): Partial<Contact> {
  const {
    name,
    company,
    profile_image: profileImage,
    email,
    birthdate,
    phone_number: phoneNumber,
    address,
  } = dto;
  return {
    name,
    company,
    profileImage,
    email,
    birthdate,
    phoneNumber,
    address,
  };
}
