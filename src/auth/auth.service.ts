import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../user/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { RefreshTokenDto } from './dto/refreshToken.dto';
import UserNotFound from '../user/errors/UserNotFound';
import RefreshTokenIsIncorrect from './error/RefreshTokenIsIncorrect';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import 'dotenv/config';
import { TokenPayload } from './type/TokenPayload';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async validateUser(login: string, password: string): Promise<any> {
    if (typeof login !== 'string' || typeof password !== 'string') {
      throw new BadRequestException('The username/password must be string');
    }
    let user;
    try {
      user = await this.userService.findOneByName(login);
    } catch (error) {
      if (error instanceof UserNotFound) {
        throw new NotFoundException();
      }
      throw error;
    }

    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new ForbiddenException();
      }
      delete user.password;
      return user;
    }
    return null;
  }

  async login(user: any) {
    if (!user) {
      throw new UserNotFound();
    }
    const payload = { login: user.login, userId: user.id };
    return {
      accessToken: await this.jwtService.sign(payload),
      refreshToken: await this.setNewRefreshToken(user),
    };
  }

  async signup(user: CreateUserDto) {
    return this.userService.create(user);
  }

  async refresh(refreshTokenDto: RefreshTokenDto) {
    const decodedObj = this.jwtService.decode(
      refreshTokenDto.refreshToken,
    ) as TokenPayload;
    if (!decodedObj) {
      throw new RefreshTokenIsIncorrect();
    }
    const user = await this.userService.findOne(decodedObj.userId);
    if (user.refreshToken !== refreshTokenDto.refreshToken) {
      throw new RefreshTokenIsIncorrect();
    }
    try {
      this.jwtService.verify(refreshTokenDto.refreshToken);
    } catch {
      throw new RefreshTokenIsIncorrect();
    }
    return await this.login(user);
  }

  async setNewRefreshToken(user: any) {
    const payload = { login: user.login, userId: user.id };
    const signOptions = {
      secret: `${process.env.JWT_SECRET_REFRESH_KEY}`,
      expiresIn: `${process.env.TOKEN_REFRESH_EXPIRE_TIME}`,
    };
    const newRefreshToken = this.jwtService.sign(payload, signOptions);
    user.refreshToken = newRefreshToken;
    await this.userRepository.save(user);
    return newRefreshToken;
  }
}
