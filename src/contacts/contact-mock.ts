import { Contact as ContactEntity } from './entities/contact.entity';
import { PhoneNumberType } from './entities/phone.entity';

const PROFILE_IMAGE =
  'data:image/jpeg;base64,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';

export const CONTACT_FULL = {
  name: 'Pablo Lopez',
  company: 'LN',
  profileImage: PROFILE_IMAGE,
  email: 'pablolopez@ln.com',
  birthdate: new Date('1981-10-20'),
  phoneNumber: {
    work: '+54 9 11 4310 2001',
    personal: '+54 9 11 4522 1551',
  },
  address: {
    line1: 'Sinsalida 21',
    line2: '5 B',
    city: 'CABA',
    state: 'CABA',
  },
};

export const CONTACT_ENTITY_FULL = {
  id: 1,
  name: 'Pablo Lopez',
  company: 'LN',
  profile_image: {
    id: 1,
    profile_image: Buffer.from(PROFILE_IMAGE),
  },
  email: 'pablolopez@ln.com',
  birthdate: new Date('1981-10-20'),
  phones: [
    {
      id: 10,
      type: PhoneNumberType.WORK,
      phone: '+54 9 11 4310 2001',
      contact: new ContactEntity(),
    },
    {
      id: 11,
      type: PhoneNumberType.PERSONAL,
      phone: '+54 9 11 4522 1551',
      contact: new ContactEntity(),
    },
  ],
  address: {
    id: 20,
    line1: 'Sinsalida 21',
    line2: '5 B',
    city: 'CABA',
    state: 'CABA',
  },
};

export const UPDATED_CONTACT_FULL = {
  ...CONTACT_FULL,
  id: 1,
  email: 'pablolopez@gmail.com',
};

export const UPDATED_CONTACT_ENTITY_FULL = {
  ...CONTACT_ENTITY_FULL,
  email: 'pablolopez@gmail.com',
};

export const CONTACT_MINIMAL = {
  name: 'Maria Gutierrez',
};

export const CONTACT_FULL_WITH_ID = {
  ...CONTACT_FULL,
  id: 1,
};

export const CREATE_CONTACT_DTO = {
  name: CONTACT_FULL_WITH_ID.name,
  company: CONTACT_FULL_WITH_ID.company,
  profile_image: CONTACT_FULL_WITH_ID.profileImage,
  email: CONTACT_FULL_WITH_ID.email,
  birthdate: CONTACT_FULL_WITH_ID.birthdate,
  phone_number: CONTACT_FULL_WITH_ID.phoneNumber,
  address: CONTACT_FULL_WITH_ID.address,
};

export const CONTACT_FULL_DTO = {
  id: CONTACT_FULL_WITH_ID.id,
  ...CREATE_CONTACT_DTO,
};

export const UPDATED_CONTACT_FULL_DTO = {
  ...CONTACT_FULL_DTO,
  email: 'pablolopez@gmail.com',
};
