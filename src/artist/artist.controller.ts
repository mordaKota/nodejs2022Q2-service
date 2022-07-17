import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseUUIDPipe,
  NotFoundException,
  Put,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ArtistService } from './artist.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { FavoritesService } from '../favorites/favorites.service';
import { AlbumService } from '../album/album.service';
import { TrackService } from '../track/track.service';

@Controller('artist')
export class ArtistController {
  constructor(
    private readonly artistService: ArtistService,
    private readonly albumService: AlbumService,
    private readonly trackService: TrackService,
    private readonly favoritesService: FavoritesService,
  ) {}

  @Post()
  async create(@Body() createArtistDto: CreateArtistDto) {
    return this.artistService.create(createArtistDto);
  }

  @Get()
  async findAll() {
    return await this.artistService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const artist = await this.artistService.findOne(id);
    if (!artist) {
      throw new NotFoundException(`The artist with id = ${id} doesn't exist`);
    }
    return artist;
  }

  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateArtistDto: UpdateArtistDto,
  ) {
    const artist = await this.artistService.update(id, updateArtistDto);
    if (!artist) {
      throw new NotFoundException(`The artist with id = ${id} doesn't exist`);
    }
    return artist;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    const artist = await this.artistService.findOne(id);
    if (!artist) {
      throw new NotFoundException(`The artist with id = ${id} doesn't exist`);
    }
    await this.artistService.remove(id);
    await this.albumService.removeArtistRef(id);
    await this.trackService.removeArtistRef(id);
    await this.favoritesService.removeArtistRef(id);
  }
}
