import { IsInt, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateAlbumDto {
  @IsString()
  name: string;
  @IsInt()
  year: number;
  @IsUUID('4')
  @IsOptional()
  artistId: string | null;
}
