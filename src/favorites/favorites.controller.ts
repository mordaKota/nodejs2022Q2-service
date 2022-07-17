import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  UnprocessableEntityException,
  NotFoundException,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { FavoritesResponse } from './dto/favorites-response.dto';
import { TrackService } from '../track/track.service';
import { ArtistService } from '../artist/artist.service';
import { AlbumService } from '../album/album.service';

@Controller('favs')
export class FavoritesController {
  constructor(
    private readonly favoritesService: FavoritesService,
    private readonly trackService: TrackService,
    private readonly artistService: ArtistService,
    private readonly albumService: AlbumService,
  ) {}

  @Get()
  getFavorites(): Promise<FavoritesResponse> {
    return this.favoritesService.getFavorites();
  }

  @Post('track/:id')
  async addTrack(@Param('id', ParseUUIDPipe) id: string) {
    let trackId;
    try {
      trackId = await this.favoritesService.addTrack(id);
    } catch (error) {
      throw new UnprocessableEntityException(
        `The track with id = ${id} doesn't exist`,
      );
    }
    return trackId;
  }

  @Delete('track/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeTrack(@Param('id', ParseUUIDPipe) id: string) {
    const trackId = await this.trackService.findOne(id);
    if (!trackId) {
      throw new NotFoundException(`The track with id = ${id} doesn't exist`);
    }
    this.favoritesService.removeTrack(id);
  }

  @Post('artist/:id')
  async addArtist(@Param('id', ParseUUIDPipe) id: string) {
    let artistId;
    try {
      artistId = await this.favoritesService.addArtist(id);
    } catch (error) {
      throw new UnprocessableEntityException(
        `The artist with id = ${id} doesn't exist`,
      );
    }
    return artistId;
  }

  @Delete('artist/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeArtist(@Param('id', ParseUUIDPipe) id: string) {
    const artistId = await this.artistService.findOne(id);
    if (!artistId) {
      throw new NotFoundException(`The artist with id = ${id} doesn't exist`);
    }
    await this.favoritesService.removeArtist(id);
  }

  @Post('album/:id')
  async addAlbum(@Param('id', ParseUUIDPipe) id: string) {
    let albumId;
    try {
      albumId = await this.favoritesService.addAlbum(id);
    } catch (error) {
      throw new UnprocessableEntityException(
        `The album with id = ${id} doesn't exist`,
      );
    }
    return albumId;
  }

  @Delete('album/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeAlbum(@Param('id', ParseUUIDPipe) id: string) {
    const albumId = await this.albumService.findOne(id);
    if (!albumId) {
      throw new NotFoundException(`The album with id = ${id} doesn't exist`);
    }
    await this.favoritesService.removeAlbum(id);
  }
}
