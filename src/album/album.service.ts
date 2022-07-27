import { Injectable } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './entities/album.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import AlbumNotFound from './errors/AlbumNotFound';
import { ArtistService } from '../artist/artist.service';

@Injectable()
export class AlbumService {
  constructor(
    @InjectRepository(Album)
    private albumRepository: Repository<Album>,
    private readonly artistService: ArtistService,
  ) {}

  async checkArtist(artistId): Promise<string | null> {
    if (artistId) {
      const artist = await this.artistService.findOne(artistId);
      if (!artist) {
        return null;
      }
      return artistId;
    }
  }

  async create(createAlbumDto: CreateAlbumDto): Promise<Album> {
    createAlbumDto.artistId = await this.checkArtist(createAlbumDto.artistId);
    const newAlbum = await this.albumRepository.create(createAlbumDto);
    return this.albumRepository.save(newAlbum);
  }

  async findAll(): Promise<Album[]> {
    return this.albumRepository.find();
  }

  async findOne(id: string): Promise<Album | undefined> {
    const album = await this.albumRepository.findOne({ where: { id: id } });
    if (!album) {
      throw new AlbumNotFound();
    }
    return album;
  }

  async update(
    id: string,
    updateAlbumDto: UpdateAlbumDto,
  ): Promise<Album | undefined> {
    updateAlbumDto.artistId = await this.checkArtist(updateAlbumDto.artistId);
    const album = await this.findOne(id);
    Object.assign(album, updateAlbumDto);
    await this.albumRepository.save(album);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.albumRepository.delete(id);
  }
}
