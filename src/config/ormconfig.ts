import { DataSourceOptions } from 'typeorm';
import 'dotenv/config';
import { User } from '../user/entities/user.entity';
import { Album } from '../album/entities/album.entity';
import { Artist } from '../artist/entities/artist.entity';
import { Track } from '../track/entities/track.entity';
import { Favorites } from '../favorites/entities/favorite.entity';

export const config: DataSourceOptions = {
  type: 'postgres',
  host: 'postgres',
  port: 5432,
  username: process.env.DB_USERNAME || 'user',
  password: process.env.DB_PASSWORD || 'pass',
  database: process.env.POSTGRES_DB || 'default',
  entities: [User, Album, Artist, Track, Favorites],
  migrations: ['dist/migrations/*{.ts,.js}'],
  synchronize: false,
  migrationsTransactionMode: 'each',
};
