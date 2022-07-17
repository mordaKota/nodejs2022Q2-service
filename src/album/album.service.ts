import { Injectable } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './entities/album.entity';
import { v4 } from 'uuid';
import { albums } from '../in-memory-db';

@Injectable()
export class AlbumService {
  async create(createAlbumDto: CreateAlbumDto): Promise<Album> {
    const newAlbum = {
      ...createAlbumDto,
      id: v4(),
    };
    albums.push(newAlbum);
    return newAlbum;
  }

  async findAll(): Promise<Album[]> {
    return albums;
  }

  async findOne(id: string): Promise<Album | undefined> {
    return albums.find((album) => album.id === id);
  }

  async update(
    id: string,
    updateAlbumDto: UpdateAlbumDto,
  ): Promise<Album | undefined> {
    const album = await this.findOne(id);
    if (album) {
      Object.assign(album, updateAlbumDto);
    }
    return album;
  }

  async remove(id: string): Promise<void> {
    albums.splice(albums.indexOf(albums.filter((album) => album.id === id)), 1);
  }

  removeArtistRef(artistId: string) {
    albums.forEach((album) => {
      if (album.artistId === artistId) {
        album.artistId = null;
      }
    });
  }
}
