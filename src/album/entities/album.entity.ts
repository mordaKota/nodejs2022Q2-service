import { IsInt, IsOptional, IsString, IsUUID } from 'class-validator';

export class Album {
  @IsUUID('4')
  id: string;
  @IsString()
  name: string;
  @IsInt()
  year: number;
  @IsUUID('4')
  @IsOptional()
  artistId: string | null;
}
