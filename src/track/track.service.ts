import { Injectable } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './entities/track.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import TrackNotFound from './errors/TrackNotFound';
import { ArtistService } from '../artist/artist.service';
import { AlbumService } from '../album/album.service';

@Injectable()
export class TrackService {
  constructor(
    @InjectRepository(Track)
    private trackRepository: Repository<Track>,
    private readonly artistService: ArtistService,
    private readonly albumService: AlbumService,
  ) {}

  async checkArtist(artistId): Promise<string> {
    if (artistId) {
      const artist = await this.artistService.findOne(artistId);
      if (!artist) {
        return null;
      }
      return artistId;
    }
  }

  async checkAlbum(albumId): Promise<string> {
    if (albumId) {
      const album = await this.albumService.findOne(albumId);
      if (!album) {
        return null;
      }
      return albumId;
    }
  }

  async create(createTrackDto: CreateTrackDto): Promise<Track> {
    createTrackDto.artistId = await this.checkArtist(createTrackDto.artistId);
    createTrackDto.albumId = await this.checkAlbum(createTrackDto.albumId);
    const newTrack = this.trackRepository.create(createTrackDto);
    return this.trackRepository.save(newTrack);
  }

  async findAll(): Promise<Track[]> {
    return this.trackRepository.find();
  }

  async findOne(id: string): Promise<Track | undefined> {
    const track = await this.trackRepository.findOne({ where: { id: id } });

    if (!track) {
      throw new TrackNotFound();
    }
    return track;
  }

  async update(
    id: string,
    updateTrackDto: UpdateTrackDto,
  ): Promise<Track | undefined> {
    updateTrackDto.artistId = await this.checkArtist(updateTrackDto.artistId);
    updateTrackDto.albumId = await this.checkAlbum(updateTrackDto.albumId);

    const track = await this.findOne(id);
    Object.assign(track, updateTrackDto);
    await this.trackRepository.save(track);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.trackRepository.delete(id);
  }
}
