import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { users } from '../in-memory-db';
import { User } from './entities/user.entity';
import { v4 } from 'uuid';

@Injectable()
export class UserService {
  async create(createUserDto: CreateUserDto): Promise<User> {
    const newUser = {
      ...createUserDto,
      id: v4(),
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    users.push(newUser);
    return newUser;
  }

  async findAll(): Promise<User[]> {
    return users;
  }

  async findOne(id: string): Promise<User | undefined> {
    return users.find((user) => user.id === id);
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User | undefined> {
    const user = await this.findOne(id);
    if (user) {
      if (updateUserDto.oldPassword !== user.password) {
        throw new Error('Not Exists');
      }

      user.password = updateUserDto.newPassword;
      user.version += user.version;
      user.updatedAt = Date.now();
      return user;
    }
  }

  remove(id: string) {
    users.splice(users.indexOf(users.filter((user) => user.id === id)), 1);
  }
}
