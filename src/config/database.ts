import { User } from '../user/entities/user.entity';

export default () => ({
  database: {
    type: process.env.DB_TYPE || 'postgres',
    host: process.env.DB_HOST || 'postgres',
    port: process.env.DATABASE_PORT || 5432,
    username: process.env.DB_USERNAME || 'user',
    password: process.env.DB_PASSWORD || 'pass',
    database: process.env.POSTGRES_DB || 'default',
    entities: [User],
    synchronize: true,
  },
});
