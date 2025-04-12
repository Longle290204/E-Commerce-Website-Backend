import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from 'src/products/Entities/product~entity';
import { BeforeInsert } from 'typeorm';
import * as removeAccents from 'remove-accents';

export enum CategoryStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
}

@Entity()
export class Category {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @ManyToMany((_type) => Product, (product) => product.categories, {
        nullable: true,
        onDelete: 'CASCADE',
    })
    products: Product[];

    @ManyToOne((_type) => Category, (category) => category.subcategories, {
        onDelete: 'CASCADE',
    })
    parent: Category;

   @OneToMany((_type) => Category, (category) => category.parent)
   subcategories: Category[];

   @Column({ unique: true })
   slug: string;

   @BeforeInsert()
   generateSlug() {
      // this.slug = this.name.toLowerCase().replace(/ /g, '-');
      this.slug = removeAccents(this.name).toLowerCase().replace(/ /g, '-');
   }

    @Column({
        type: 'enum',
        enum: CategoryStatus,
        default: CategoryStatus.ACTIVE,
    })
    status: CategoryStatus; 

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    upDatedAt: Date;
}
