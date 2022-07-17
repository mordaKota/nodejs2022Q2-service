import { IsString, IsUUID } from 'class-validator';

export class CreateArtistDto {
  @IsString()
  name: string;
  grammy: boolean;
}
