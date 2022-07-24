import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import UserPassIsWrong from './errors/UserPassIsWrong';
import UserNotFound from './errors/UserNotFound';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const newUser = this.userRepository.create(createUserDto);
    return this.userRepository.save(newUser);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { id: id } });
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User | undefined> {
    const user = await this.findOne(id);

    if (!user) {
      throw new UserNotFound();
    }

    if (updateUserDto.oldPassword !== user.password) {
      throw new UserPassIsWrong();
    }

    user.password = updateUserDto.newPassword;
    return this.userRepository.save(user);
  }

  async remove(id: string) {
    await this.userRepository.delete(id);
  }
}
