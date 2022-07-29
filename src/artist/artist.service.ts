import { Injectable } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';
import { v4 } from 'uuid';
import { artists } from '../in-memory-db';

@Injectable()
export class ArtistService {
  async create(createArtistDto: CreateArtistDto): Promise<Artist> {
    const newArtist = {
      ...createArtistDto,
      id: v4(),
    };
    artists.push(newArtist);
    return newArtist;
  }

  async findAll(): Promise<Artist[]> {
    return artists;
  }

  async findOne(id: string): Promise<Artist | undefined> {
    return artists.find((artist) => artist.id === id);
  }

  async update(id: string, updateArtistDto: UpdateArtistDto): Promise<Artist> {
    const artist = await this.findOne(id);
    if (artist) {
      Object.assign(artist, updateArtistDto);
    }
    return artist;
  }

  async remove(id: string): Promise<void> {
    artists.splice(
      artists.indexOf(artists.filter((artist) => artist.id === id)),
      1,
    );
  }
}
