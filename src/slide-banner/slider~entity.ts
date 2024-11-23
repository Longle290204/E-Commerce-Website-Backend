import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class SlideBanner {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  imageURL: string;
}
