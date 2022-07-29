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
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { ArtistService } from './artist.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import ArtistNotFound from './errors/ArtistNotFound';

@Controller('artist')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  async create(@Body() createArtistDto: CreateArtistDto) {
    return this.artistService.create(createArtistDto);
  }

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  async findAll() {
    return await this.artistService.findAll();
  }

  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    let artist;
    try {
      artist = await this.artistService.findOne(id);
    } catch (error) {
      if (error instanceof ArtistNotFound) {
        throw new NotFoundException(`The artist with id = ${id} doesn't exist`);
      }
    }
    return artist;
  }

  @Put(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateArtistDto: UpdateArtistDto,
  ) {
    let artist;
    try {
      artist = await this.artistService.update(id, updateArtistDto);
    } catch (error) {
      if (error instanceof ArtistNotFound) {
        throw new NotFoundException(`The artist with id = ${id} doesn't exist`);
      }
      throw error;
    }

    return artist;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    try {
      await this.artistService.findOne(id);
    } catch (error) {
      if (error instanceof ArtistNotFound) {
        throw new NotFoundException(`The artist with id = ${id} doesn't exist`);
      }
    }
    await this.artistService.remove(id);
  }
}
