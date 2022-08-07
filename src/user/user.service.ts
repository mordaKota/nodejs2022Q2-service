import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import UserPassIsWrong from './errors/UserPassIsWrong';
import UserNotFound from './errors/UserNotFound';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const salt = await bcrypt.genSalt();
    createUserDto.password = await bcrypt.hash(createUserDto.password, salt);
    const newUser = this.userRepository.create(createUserDto);
    return this.userRepository.save(newUser);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: string): Promise<User | undefined> {
    const user = await this.userRepository.findOne({ where: { id: id } });
    if (!user) {
      throw new UserNotFound();
    }
    return user;
  }

  async findOneByName(login: string): Promise<User | undefined> {
    const user = await this.userRepository.findOneBy({ login });
    if (!user) {
      throw new UserNotFound();
    }
    return user;
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User | undefined> {
    const user = await this.findOne(id);

    if (!user) {
      throw new UserNotFound();
    }

    const isMatch = await bcrypt.compare(
      updateUserDto.oldPassword,
      user.password,
    );
    if (!isMatch) {
      throw new UserPassIsWrong();
    }

    user.password = await bcrypt.hash(
      updateUserDto.newPassword,
      await bcrypt.genSalt(),
    );

    return this.userRepository.save(user);
  }

  async remove(id: string) {
    await this.userRepository.delete(id);
  }
}
