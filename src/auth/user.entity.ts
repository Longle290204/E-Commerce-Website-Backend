import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Task } from '../tasks/task~entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true }) 
  username: string;

  @Column({unique: true})
  phoneNumber: string;

  @Column()
  password: string;

  @OneToMany((_type) => Task, (task) => task.user, {eager: true})
  tasks: Task[];
}

// eager: true cho biết rằng mỗi khi thực thể User được truy vấn từ cơ sở
//  dữ liệu, tất cả các tasks liên quan sẽ tự động được tải cùng lúc (eager loading).
