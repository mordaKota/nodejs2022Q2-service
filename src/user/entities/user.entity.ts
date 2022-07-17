import { IsString, IsUUID } from 'class-validator';
import { Exclude } from 'class-transformer';

export class User {
  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
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
