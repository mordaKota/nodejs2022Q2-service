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
import UserPassIsWrong from './errors/UserPassIsWrong';
import UserNotFound from './errors/UserNotFound';
import { Public } from '../auth/public.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Public()
  @UseInterceptors(ClassSerializerInterceptor)
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
    let user;
    try {
      user = await this.userService.findOne(id);
    } catch (error) {
      if (error instanceof UserNotFound) {
        throw new NotFoundException(`The user with id = ${id} doesn't exist`);
      }
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
      if (error instanceof UserPassIsWrong) {
        throw new ForbiddenException('The oldPassword is wrong');
      }
      if (error instanceof UserNotFound) {
        throw new NotFoundException(`The user with id = ${id} doesn't exist`);
      }

      throw error;
    }

    return user;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    try {
      await this.userService.findOne(id);
    } catch (error) {
      if (error instanceof UserNotFound) {
        throw new NotFoundException(`The user with id = ${id} doesn't exist`);
      }
      throw error;
    }
    await this.userService.remove(id);
  }
}
