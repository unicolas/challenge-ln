type WorkPhone = { work: string };
type PersonalPhone = { personal: string };
export type Phone = WorkPhone | PersonalPhone | (WorkPhone & PersonalPhone);
export type Address = {
  line1: string;
  line2?: string;
  city: string;
  state: string;
};
export type Contact = {
  name: string;
  company?: string;
  profileImage?: string;
  email?: string;
  birthdate?: Date;
  phoneNumber?: Phone;
  address?: Address;
};
export type ContactId = number & { readonly __tag: unique symbol };
export type ContactWithId = { id: ContactId } & Contact;
