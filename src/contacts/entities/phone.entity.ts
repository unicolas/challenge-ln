import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Contact } from './contact.entity';
import { MAX_PHONE_LENGTH } from '../constants';

export enum PhoneNumberType {
  WORK = 'work',
  PERSONAL = 'personal',
}

@Entity()
export class Phone {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: PhoneNumberType })
  type: PhoneNumberType;

  @Column({ length: MAX_PHONE_LENGTH })
  phone: string;

  @ManyToOne(() => Contact, (contact) => contact.phones)
  @JoinColumn()
  contact: Contact;
}
