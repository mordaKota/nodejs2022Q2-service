import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Delete,
  NotFoundException,
  ForbiddenException,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  async findAll() {
    return await this.userService.findAll();
  }

  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const user = await this.userService.findOne(id);
    if (!user) {
      throw new NotFoundException(`The user with id = ${id} doesn't exist`);
    }
    return user;
  }

  @Put(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    let user;
    try {
      user = await this.userService.update(id, updateUserDto);
    } catch (error) {
      if (error instanceof Error) {
        throw new ForbiddenException('The oldPassword is wrong');
      }
    }
    if (!user) {
      throw new NotFoundException(`The user with id = ${id} doesn't exist`);
    }
    return user;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    const user = await this.userService.findOne(id);
    if (!user) {
      throw new NotFoundException(`The user with id = ${id} doesn't exist`);
    }
    await this.userService.remove(id);
  }
}
