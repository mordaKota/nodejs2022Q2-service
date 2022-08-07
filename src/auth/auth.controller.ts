import {
  Body,
  Controller,
  Request,
  Post,
  UseGuards,
  HttpCode,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { Public } from './public.decorator';
import { RefreshTokenDto } from './dto/refreshToken.dto';
import RefreshTokenIsIncorrect from './error/RefreshTokenIsIncorrect';
import UserNotFound from '../user/errors/UserNotFound';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.signup(createUserDto);
  }

  @Public()
  @Post('login')
  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  async login(@Request() req) {
    let res;
    try {
      res = await this.authService.login(req.user);
    } catch (error) {
      if (error instanceof UserNotFound) {
        throw new NotFoundException(`The user doesn't exist`);
      }
      throw error;
    }
    return res;
  }

  @Public()
  @HttpCode(200)
  @Post('refresh')
  async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    if (!refreshTokenDto.refreshToken) {
      throw new UnauthorizedException();
    }
    let refreshResult;
    try {
      refreshResult = await this.authService.refresh(refreshTokenDto);
    } catch (error) {
      if (error instanceof RefreshTokenIsIncorrect) {
        throw new ForbiddenException();
      }
    }
    return refreshResult;
  }
}
