import { forwardRef, Module } from '@nestjs/common';
import { ArtistService } from './artist.service';
import { ArtistController } from './artist.controller';
import { TrackModule } from '../track/track.module';
import { FavoritesModule } from '../favorites/favorites.module';
import { AlbumModule } from '../album/album.module';

@Module({
  imports: [
    forwardRef(() => TrackModule),
    forwardRef(() => FavoritesModule),
    forwardRef(() => AlbumModule),
  ],
  controllers: [ArtistController],
  providers: [ArtistService],
  exports: [ArtistService],
})
export class ArtistModule {}
