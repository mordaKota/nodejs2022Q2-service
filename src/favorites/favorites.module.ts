import { forwardRef, Module } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { FavoritesController } from './favorites.controller';
import { TrackModule } from 'src/track/track.module';
import { ArtistModule } from '../artist/artist.module';
import { AlbumModule } from '../album/album.module';

@Module({
  imports: [
    forwardRef(() => TrackModule),
    forwardRef(() => AlbumModule),
    forwardRef(() => ArtistModule),
  ],
  controllers: [FavoritesController],
  providers: [FavoritesService],
  exports: [FavoritesService],
})
export class FavoritesModule {}
