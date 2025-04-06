import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { User } from 'src/auth/user.entity';

@Entity()
export class Role {
   @PrimaryGeneratedColumn('uuid')
   id: string;

   @Column({ unique: true })
   name: string;

   @OneToMany(() => User, (user) => user.role)
   users: User[];
}
