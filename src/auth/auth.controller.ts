import { Controller, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CurrentUser } from './current-user.decorator';
import { User } from '../users/entities/user.entity';
import { AuthService } from './auth.service';
import {  JwtRefreshAuthGuard } from './guards/jwt-auth.guard';
import { TokenPayload } from './token-payload.interface';
import { JwtAccessAuthGuard } from './guards/jwt-access-auth.guard';

@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService) {
  }

  tokenResponse(data: User | TokenPayload, res: Response, message: string) {
    const { refreshToken, expires, accessToken } = this.authService.createToken(data);

    res.cookie('Authentication', refreshToken, {
      httpOnly: true,
      expires: expires,
    });

    res.status(200).json({ message, token: accessToken });
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) res: Response,
  ) {
    this.tokenResponse(user, res, 'login success');
  }

  @Post('refresh')
  @UseGuards(JwtRefreshAuthGuard)
  async refresh(
    @CurrentUser() token: TokenPayload,
    @Res({ passthrough: true }) res: Response,
  ) {
    this.tokenResponse(token, res, 'refresh success');
  }

  @Post('protected')
  @UseGuards(JwtAccessAuthGuard)
  async protectedRoute(
    @CurrentUser() user: TokenPayload,
  ) {
    return { message: 'You have access to this route', token: user };
  }
}
