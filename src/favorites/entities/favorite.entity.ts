import { Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Album } from '../../album/entities/album.entity';
import { Track } from '../../track/entities/track.entity';
import { Artist } from '../../artist/entities/artist.entity';

@Entity('favorites')
export class Favorites {
  @Exclude()
  @PrimaryColumn({ default: 1 })
  id: number;

  @OneToMany(() => Album, (album) => album.favorites, {
    nullable: true,
    onDelete: 'SET NULL',
    cascade: true,
    eager: true,
  })
  albums: Album[];

  @OneToMany(() => Track, (track) => track.favorites, {
    nullable: true,
    onDelete: 'SET NULL',
    cascade: true,
    eager: true,
  })
  tracks: Track[];

  @OneToMany(() => Artist, (artist) => artist.favorites, {
    nullable: true,
    onDelete: 'SET NULL',
    cascade: true,
    eager: true,
  })
  artists: Artist[];
}
