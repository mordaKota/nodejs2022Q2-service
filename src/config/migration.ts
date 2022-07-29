import { DataSource } from 'typeorm';
import { config } from './ormconfig';

export const connectionSource = new DataSource(config);
