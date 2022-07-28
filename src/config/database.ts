import { User } from '../user/entities/user.entity';
import { Album } from '../album/entities/album.entity';
import { Artist } from '../artist/entities/artist.entity';
import { Track } from '../track/entities/track.entity';
import { Favorites } from '../favorites/entities/favorite.entity';
import 'dotenv/config';

export default () => ({
  database: {
    type: process.env.DB_TYPE || 'postgres',
    host: process.env.DB_HOST || 'postgres',
    port: process.env.DATABASE_PORT || 5432,
    username: process.env.DB_USERNAME || 'user',
    password: process.env.DB_PASSWORD || 'pass',
    database: process.env.POSTGRES_DB || 'default',
    entities: [User, Album, Artist, Track, Favorites],
    synchronize: process.env.DB_HOST || true,
  },
});
