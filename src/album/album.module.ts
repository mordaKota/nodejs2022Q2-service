import { forwardRef, Module } from '@nestjs/common';
import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';
import { TrackModule } from '../track/track.module';
import { FavoritesModule } from '../favorites/favorites.module';
import { ArtistModule } from '../artist/artist.module';

@Module({
  imports: [
    forwardRef(() => TrackModule),
    forwardRef(() => FavoritesModule),
    forwardRef(() => ArtistModule),
  ],
  controllers: [AlbumController],
  providers: [AlbumService],
  exports: [AlbumService],
})
export class AlbumModule {}
