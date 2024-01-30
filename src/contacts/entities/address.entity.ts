import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import {
  MAX_ADDRESS_LINE1_LENGTH,
  MAX_ADDRESS_LINE2_LENGTH,
  MAX_CITY_LENGTH,
  MAX_STATE_LENGTH,
} from '../constants';

@Entity()
export class Address {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: MAX_ADDRESS_LINE1_LENGTH })
  line1: string;

  @Column({ length: MAX_ADDRESS_LINE2_LENGTH, nullable: true })
  line2?: string;

  @Column({ length: MAX_CITY_LENGTH })
  city: string;

  @Column({ length: MAX_STATE_LENGTH })
  state: string;
}
