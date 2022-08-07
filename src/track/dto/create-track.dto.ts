import { IsInt, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateTrackDto {
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
