import { Contact as ContactEntity } from './contact.entity';
import { Address as AddressEntity } from './address.entity';
import { Phone as PhoneEntity, PhoneNumberType } from './phone.entity';
import { ProfileImage as ProfileImageEntity } from './profileImage.entity';
import { ContactId, Contact, ContactWithId, Address, Phone } from '../types';

function mapAddressEntity(address: AddressEntity): Address {
  const { line1, line2, city, state } = address;
  return { line1, line2, city, state };
}

function mapPhoneEntity(entities: PhoneEntity[]): Phone | undefined {
  const phone = entities.reduce((acc, p: PhoneEntity) => {
    if (p.type === PhoneNumberType.WORK) {
      return { ...acc, work: p.phone };
    } else if (p.type === PhoneNumberType.PERSONAL) {
      return { ...acc, personal: p.phone };
    } else {
      return acc;
    }
  }, {});
  return Object.keys(phone).length !== 0 ? (phone as Phone) : undefined;
}

export function mapContactEntity(entity: ContactEntity): ContactWithId {
  const profileImage =
    entity.profile_image?.profile_image.toString() ?? undefined;
  const address = entity.address ? mapAddressEntity(entity.address) : undefined;
  const phoneNumber = mapPhoneEntity(entity.phones ?? []);
  return {
    id: entity.id as ContactId,
    name: entity.name,
    company: entity.company ?? undefined,
    profileImage,
    email: entity.email ?? undefined,
    birthdate: entity.birthdate ?? undefined,
    phoneNumber,
    address,
  };
}

function mapPhone(phone: Phone, contact: ContactEntity): PhoneEntity[] {
  const numberType = (t: string) =>
    t === 'work' ? PhoneNumberType.WORK : PhoneNumberType.PERSONAL;
  return Object.entries(phone).map(
    ([type, number]) =>
      ({
        type: numberType(type),
        phone: number,
        contact,
      }) as PhoneEntity,
  );
}

function mapAddress(address: Address): AddressEntity {
  const { line1, line2, city, state } = address;
  return { line1, line2, city, state } as AddressEntity;
}

export function mapContact<C extends Contact | Partial<Contact>>(
  contact: C,
  id?: ContactId,
): C extends Contact ? ContactEntity : Partial<ContactEntity> {
  const entity = new ContactEntity();
  if (id !== undefined) {
    entity.id = id;
  }
  if (contact.name !== undefined) {
    entity.name = contact.name;
  }
  entity.company = contact.company;
  if (contact.profileImage) {
    entity.profile_image = {
      profile_image: Buffer.from(contact.profileImage),
    } as ProfileImageEntity;
  }
  entity.email = contact.email;
  entity.birthdate = contact.birthdate;
  if (contact.phoneNumber !== undefined) {
    entity.phones = mapPhone(contact.phoneNumber, entity);
  }
  if (contact.address !== undefined) {
    entity.address = mapAddress(contact.address);
  }
  return entity;
}

export function mapContactEntities(contacts: ContactEntity[]): ContactWithId[] {
  return contacts.map((contact) => mapContactEntity(contact));
}
