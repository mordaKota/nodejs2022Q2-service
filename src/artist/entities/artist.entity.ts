import { IsBoolean, IsString } from 'class-validator';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Favorites } from '../../favorites/entities/favorite.entity';

@Entity('artist')
export class Artist {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @IsString()
  name: string;

  @Column('boolean')
  @IsBoolean()
  grammy: boolean;

  @Exclude()
  @ManyToOne(() => Favorites, (favorites) => favorites.artists, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  favorites: Favorites;
}
