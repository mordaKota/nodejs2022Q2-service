import { IsInt, IsOptional, IsString, IsUUID } from 'class-validator';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Artist } from '../../artist/entities/artist.entity';
import { Album } from '../../album/entities/album.entity';
import { Favorites } from '../../favorites/entities/favorite.entity';

@Entity('track')
export class Track {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID('4')
  id: string;

  @Column()
  @IsString()
  name: string;

  @Column({ nullable: true, default: null })
  @IsUUID('4')
  @IsOptional()
  artistId: string | null;

  @Column({ nullable: true, default: null })
  @IsUUID('4')
  @IsOptional()
  albumId: string | null;

  @Column()
  @IsInt()
  duration: number;

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
  @ManyToOne(() => Album, {
    nullable: true,
    onDelete: 'SET NULL',
    cascade: true,
    eager: true,
  })
  @JoinColumn()
  album: Album;

  @Exclude()
  @ManyToOne(() => Favorites, (favorites) => favorites.tracks)
  favorites: Favorites;
}
