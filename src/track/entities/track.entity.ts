import { IsInt, IsOptional, IsString, IsUUID } from 'class-validator';

export class Track {
  @IsUUID('4')
  id: string;
  @IsString()
  name: string;
  @IsUUID('4')
  @IsOptional()
  artistId: string | null;
  @IsUUID('4')
  @IsOptional()
  albumId: string | null;
  @IsInt()
  duration: number;
}
