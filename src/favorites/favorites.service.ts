import { Injectable } from '@nestjs/common';
import { FavoritesResponse } from './dto/favorites-response.dto';
import { TrackService } from '../track/track.service';
import { AlbumService } from '../album/album.service';
import { ArtistService } from '../artist/artist.service';
import { favorites } from '../in-memory-db';

@Injectable()
export class FavoritesService {
  constructor(
    private readonly trackService: TrackService,
    private readonly albumService: AlbumService,
    private readonly artistService: ArtistService,
  ) {}

  async getFavorites(): Promise<FavoritesResponse> {
    return {
      albums: await Promise.all(
        favorites.albums.map((albumId) => this.albumService.findOne(albumId)),
      ),
      artists: await Promise.all(
        favorites.artists.map((artistId) =>
          this.artistService.findOne(artistId),
        ),
      ),
      tracks: await Promise.all(
        favorites.tracks.map((trackId) => this.trackService.findOne(trackId)),
      ),
    };
  }

  async addTrack(id: string): Promise<void> {
    const track = await this.trackService.findOne(id);
    if (!track) {
      throw new Error('Not Exists');
    }

    if (!favorites.tracks.includes(id)) {
      favorites.tracks.push(track.id);
    }
  }

  async removeTrack(id: string): Promise<void> {
    const favTracksIds = favorites.tracks;
    const trackId = favTracksIds.filter((trackId) => trackId === id);
    favTracksIds.splice(favTracksIds.indexOf(trackId[0]), 1);
  }

  async addArtist(id: string): Promise<void> {
    const artist = await this.artistService.findOne(id);
    if (!artist) {
      throw new Error('Not Exists');
    }

    if (!favorites.artists.includes(id)) {
      favorites.artists.push(artist.id);
    }
  }

  async removeArtist(id: string): Promise<void> {
    const favArtistIds = favorites.artists;
    const artistsId = favArtistIds.filter((artistId) => artistId === id);
    favArtistIds.splice(favArtistIds.indexOf(artistsId[0]), 1);
  }

  async addAlbum(id: string): Promise<void> {
    const album = await this.albumService.findOne(id);
    if (!album) {
      throw new Error('Not Exists');
    }

    if (!favorites.albums.includes(id)) {
      favorites.albums.push(album.id);
    }
  }

  async removeAlbum(id: string): Promise<void> {
    const favAlbumIds = favorites.albums;
    const albumsId = favAlbumIds.filter((albumId) => albumId === id);
    favAlbumIds.splice(favAlbumIds.indexOf(albumsId[0]), 1);
  }

  removeAlbumRef(id: string) {
    const albumsIdsInFavs = favorites.albums;
    const index = albumsIdsInFavs.findIndex((albumId) => albumId === id);
    albumsIdsInFavs.splice(index, 1);
  }

  removeTrackRef(id: string) {
    const tracksIdsInFavs = favorites.tracks;
    const index = tracksIdsInFavs.findIndex((trackId) => trackId === id);
    tracksIdsInFavs.splice(index, 1);
  }

  removeArtistRef(id: string) {
    const artistsIdsInFavs = favorites.artists;
    const index = artistsIdsInFavs.findIndex((artistId) => artistId === id);
    artistsIdsInFavs.splice(index, 1);
  }
}
