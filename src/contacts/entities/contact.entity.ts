import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { ProfileImage } from './profileImage.entity';
import { Address } from './address.entity';
import { Phone } from './phone.entity';
import {
  MAX_COMPANY_LENGTH,
  MAX_EMAIL_LENGTH,
  MAX_NAME_LENGTH,
} from '../constants';

@Entity()
export class Contact {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: MAX_NAME_LENGTH })
  name: string;

  @Column({ length: MAX_COMPANY_LENGTH, nullable: true })
  company?: string;

  @OneToOne(() => ProfileImage, {
    onDelete: 'CASCADE',
    cascade: true,
    eager: true,
  })
  @JoinColumn()
  profile_image?: ProfileImage;

  @Column({ length: MAX_EMAIL_LENGTH, nullable: true })
  email?: string;

  @Column('date', { nullable: true })
  birthdate?: Date;

  @OneToMany(() => Phone, (phone) => phone.contact, {
    cascade: true,
    eager: true,
  })
  phones: Phone[];

  @OneToOne(() => Address, { onDelete: 'CASCADE', cascade: true, eager: true })
  @JoinColumn()
  address?: Address;
}
