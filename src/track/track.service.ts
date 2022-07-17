import { Injectable } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './entities/track.entity';
import { v4 } from 'uuid';
import { tracks } from '../in-memory-db';

@Injectable()
export class TrackService {
  async create(createTrackDto: CreateTrackDto): Promise<Track> {
    const newTrack = {
      ...createTrackDto,
      id: v4(),
    };
    tracks.push(newTrack);
    return newTrack;
  }

  async findAll(): Promise<Track[]> {
    return tracks;
  }

  async findOne(id: string): Promise<Track | undefined> {
    return tracks.find((track) => track.id === id);
  }

  async update(
    id: string,
    updateTrackDto: UpdateTrackDto,
  ): Promise<Track | undefined> {
    console.log(id);
    const track = await this.findOne(id);
    console.log(track);
    if (track) {
      Object.assign(track, updateTrackDto);
    }
    return track;
  }

  remove(id: string) {
    tracks.splice(tracks.indexOf(tracks.filter((track) => track.id === id)), 1);
  }

  removeArtistRef(artistId: string) {
    tracks.forEach((track) => {
      if (track.artistId === artistId) {
        track.artistId = null;
      }
    });
  }

  removeAlbumRef(albumId: string) {
    tracks.forEach((track) => {
      if (track.albumId === albumId) {
        track.albumId = null;
      }
    });
  }
}
