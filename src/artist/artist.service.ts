import { Injectable } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import ArtistNotFound from './errors/ArtistNotFound';

@Injectable()
export class ArtistService {
  constructor(
    @InjectRepository(Artist)
    private artistRepository: Repository<Artist>,
  ) {}

  async create(createArtistDto: CreateArtistDto): Promise<Artist> {
    const newArtist = await this.artistRepository.create(createArtistDto);
    return this.artistRepository.save(newArtist);
  }

  async findAll(): Promise<Artist[]> {
    return this.artistRepository.find();
  }

  async findOne(id: string): Promise<Artist | undefined> {
    const artist = await this.artistRepository.findOne({ where: { id: id } });
    if (!artist) {
      throw new ArtistNotFound();
    }
    return artist;
  }

  async update(id: string, updateArtistDto: UpdateArtistDto): Promise<Artist> {
    const artist = await this.findOne(id);
    Object.assign(artist, updateArtistDto);
    return this.artistRepository.save(artist);
  }

  async remove(id: string): Promise<void> {
    await this.artistRepository.delete(id);
  }
}
