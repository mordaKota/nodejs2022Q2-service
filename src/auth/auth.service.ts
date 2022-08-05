import { ForbiddenException, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../user/dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(login: string, password: string): Promise<any> {
    const user = await this.userService.findOneByName(login);

    // if (user && user.password === password) {
    //   const { password, ...result } = user;
    //   return result;
    // }
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
    const payload = { login: user.login, userId: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async signup(user: CreateUserDto) {
    return this.userService.create(user);
  }
}
