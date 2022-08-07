import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  ParseUUIDPipe,
  NotFoundException,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { TrackService } from './track.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import TrackNotFound from './errors/TrackNotFound';
import ArtistNotFound from '../artist/errors/ArtistNotFound';
import AlbumNotFound from '../album/errors/AlbumNotFound';

@Controller('track')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  async create(@Body() createTrackDto: CreateTrackDto) {
    let track;
    try {
      track = await this.trackService.create(createTrackDto);
    } catch (error) {
      if (error instanceof ArtistNotFound) {
        throw new NotFoundException(`The artist with ArtistId doesn't exist`);
      }
      if (error instanceof AlbumNotFound) {
        throw new NotFoundException(`The album with AlbumId doesn't exist`);
      }
      throw error;
    }
    return track;
  }

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  async findAll() {
    return await this.trackService.findAll();
  }

  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    let track;
    try {
      track = await this.trackService.findOne(id);
    } catch (error) {
      if (error instanceof TrackNotFound) {
        throw new NotFoundException(`The track with id = ${id} doesn't exist`);
      }
      if (error instanceof ArtistNotFound) {
        throw new NotFoundException(`The artist with ArtistId doesn't exist`);
      }
      if (error instanceof AlbumNotFound) {
        throw new NotFoundException(`The album with AlbumId doesn't exist`);
      }
    }
    return track;
  }

  @Put(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTrackDto: UpdateTrackDto,
  ) {
    let track;
    try {
      track = await this.trackService.update(id, updateTrackDto);
    } catch (error) {
      if (error instanceof TrackNotFound) {
        throw new NotFoundException(`The track with id = ${id} doesn't exist`);
      }
      if (error instanceof ArtistNotFound) {
        throw new NotFoundException(`The artist with ArtistId doesn't exist`);
      }
      if (error instanceof AlbumNotFound) {
        throw new NotFoundException(`The album with AlbumId doesn't exist`);
      }
      throw error;
    }

    return track;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    try {
      await this.trackService.findOne(id);
    } catch (error) {
      if (error instanceof TrackNotFound) {
        throw new NotFoundException(`The track with id = ${id} doesn't exist`);
      }
    }
    await this.trackService.remove(id);
  }
}
