import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User_profile {
  @PrimaryGeneratedColumn('uuid')
  user_id: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  first_name: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  second_name: string;

  @Column({ type: 'varchar', length: 30, nullable: true })
  email: string;

  @Column({ type: 'date', nullable: true })
  birth_date: Date;

  @Column({ type: 'varchar', nullable: true })
  avatar_id: string;
}
