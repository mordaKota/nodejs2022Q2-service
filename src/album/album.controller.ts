import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  NotFoundException,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { AlbumService } from './album.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import AlbumNotFound from './errors/AlbumNotFound';
import ArtistNotFound from '../artist/errors/ArtistNotFound';

@Controller('album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  async create(@Body() createAlbumDto: CreateAlbumDto) {
    let album;
    try {
      album = await this.albumService.create(createAlbumDto);
    } catch (error) {
      if (error instanceof ArtistNotFound) {
        throw new NotFoundException(`The artist with ArtistId doesn't exist`);
      }
      throw error;
    }
    return album;
  }

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  async findAll() {
    return await this.albumService.findAll();
  }

  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    let album;
    try {
      album = await this.albumService.findOne(id);
    } catch (error) {
      if (error instanceof AlbumNotFound) {
        throw new NotFoundException(`The album with id = ${id} doesn't exist`);
      }
    }
    return album;
  }

  @Put(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAlbumDto: UpdateAlbumDto,
  ) {
    let album;
    try {
      album = await this.albumService.update(id, updateAlbumDto);
    } catch (error) {
      if (error instanceof AlbumNotFound) {
        throw new NotFoundException(`The album with id = ${id} doesn't exist`);
      }
      if (error instanceof ArtistNotFound) {
        throw new NotFoundException(`The artist with ArtistId doesn't exist`);
      }
      throw error;
    }
    return album;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    try {
      await this.albumService.findOne(id);
    } catch (error) {
      if (error instanceof AlbumNotFound) {
        throw new NotFoundException(`The album with id = ${id} doesn't exist`);
      }
    }
    await this.albumService.remove(id);
  }
}
