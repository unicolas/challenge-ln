import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ProfileImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('bytea')
  profile_image: Buffer;
}
