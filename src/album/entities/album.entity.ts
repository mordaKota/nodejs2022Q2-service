import {
  JoinColumn,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Artist } from '../../artist/entities/artist.entity';
import { Favorites } from '../../favorites/entities/favorite.entity';

@Entity('album')
export class Album {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  year: number;

  @Column({ nullable: true, default: null })
  artistId: string | null;

  @Exclude()
  @ManyToOne(() => Artist, {
    nullable: true,
    onDelete: 'SET NULL',
    cascade: true,
    eager: true,
  })
  @JoinColumn()
  artist: Artist;

  @Exclude()
  @ManyToOne(() => Favorites, (favorites) => favorites.albums, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  favorites: Favorites;
}
