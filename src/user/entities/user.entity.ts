import { IsString, IsUUID } from 'class-validator';
import { Exclude } from 'class-transformer';

export class User {
  @IsUUID('4')
  id: string;
  @IsString()
  login: string;
  @Exclude()
  password: string;
  version: number;
  createdAt: number;
  updatedAt: number;
}
