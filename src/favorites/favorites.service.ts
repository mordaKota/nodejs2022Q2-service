import { Injectable } from '@nestjs/common';
import { FavoritesResponse } from './dto/favorites-response.dto';
import { TrackService } from '../track/track.service';
import { AlbumService } from '../album/album.service';
import { ArtistService } from '../artist/artist.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Favorites } from './entities/favorite.entity';
import { ArrayContains, Repository } from 'typeorm';
import TrackNotFound from '../track/errors/TrackNotFound';
import ArtistNotFound from '../artist/errors/ArtistNotFound';
import AlbumNotFound from '../album/errors/AlbumNotFound';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorites)
    private favoritesRepository: Repository<Favorites>,
    private readonly trackService: TrackService,
    private readonly albumService: AlbumService,
    private readonly artistService: ArtistService,
  ) {}

  async getFavorites(): Promise<FavoritesResponse> {
    const favorites = await this.favoritesRepository.findOne({
      where: { id: 1 },
    });

    if (!favorites) {
      const newFavorites = this.favoritesRepository.create({
        tracks: [],
        albums: [],
        artists: [],
      });
      await this.favoritesRepository.save(newFavorites);
      return this.favoritesRepository.findOne({ where: { id: 1 } });
    }
    return favorites;
  }

  async addTrack(id: string): Promise<void> {
    const track = await this.trackService.findOne(id);
    if (!track) {
      throw new TrackNotFound();
    }
    const favorites = await this.getFavorites();
    favorites.tracks.push(track);
    await this.favoritesRepository.save(favorites);
  }

  async removeTrack(id: string): Promise<void> {
    const track = await this.trackService.findOne(id);
    const trackInFavs = await this.favoritesRepository.findBy({
      tracks: ArrayContains([track]),
    });
    if (!trackInFavs) {
      throw new TrackNotFound();
    }
    const favorites = await this.getFavorites();
    favorites.tracks = favorites.tracks.filter((track) => track.id !== id);
    await this.favoritesRepository.save(favorites);
  }

  async addArtist(id: string): Promise<void> {
    const artist = await this.artistService.findOne(id);
    const favorites = await this.getFavorites();
    favorites.artists.push(artist);
    await this.favoritesRepository.save(favorites);
  }

  async removeArtist(id: string): Promise<void> {
    const artist = await this.artistService.findOne(id);
    console.log('artist', artist);
    const artistInFavs = await this.favoritesRepository.findBy({
      artists: ArrayContains([artist]),
    });
    console.log('artist in favs', artistInFavs);
    if (!artistInFavs) {
      throw new ArtistNotFound();
    }
    const favorites = await this.getFavorites();
    favorites.artists = favorites.artists.filter((artist) => artist.id !== id);
    await this.favoritesRepository.save(favorites);
  }

  async addAlbum(id: string): Promise<void> {
    const album = await this.albumService.findOne(id);
    const favorites = await this.getFavorites();
    favorites.albums.push(album);
    await this.favoritesRepository.save(favorites);
  }

  async removeAlbum(id: string): Promise<void> {
    const album = await this.albumService.findOne(id);
    const albumInFavs = await this.favoritesRepository.findBy({
      albums: ArrayContains([album]),
    });
    if (!albumInFavs) {
      throw new AlbumNotFound();
    }
    const favorites = await this.getFavorites();
    favorites.albums = favorites.albums.filter((album) => album.id !== id);
    await this.favoritesRepository.save(favorites);
  }
}
