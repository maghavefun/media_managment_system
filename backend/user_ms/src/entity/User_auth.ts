import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User_profile } from './User_profile';

@Entity()
export class User_auth {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  username: string;

  @Column('varchar')
  password: string;

  @Column('varchar')
  salt: string;

  @OneToOne(() => User_profile, { cascade: true })
  @JoinColumn()
  profile: User_profile;
}
