import {Injectable} from '@nestjs/common';
import {User} from '../users/entities/user.entity';
import {ConfigService} from '@nestjs/config';
import {TokenPayload} from './token-payload.interface';
import {JwtService} from '@nestjs/jwt';
import {Request, Response} from 'express';

@Injectable()
export class AuthService {

  constructor(private readonly configService: ConfigService, private readonly jwtService: JwtService) {
  }

  createToken(user: User | TokenPayload): { refreshToken: string, accessToken: string, expires: Date } {
    const expires = new Date();
    expires.setSeconds(
      expires.getSeconds() + this.configService.getOrThrow('JWT_EXPIRATION'),
    );

    let _id: string;
    if (user instanceof User) {
      _id = user._id.toHexString();
    } else {
      _id = user._id;
    }

    const tokenPayload: TokenPayload = {
      ...user,
      _id,
    };

    const accessToken = this.jwtService.sign(tokenPayload, {
      expiresIn: this.configService.getOrThrow('JWT_ACCESS_EXPIRATION'),
      secret: this.configService.getOrThrow('JWT_ACCESS_SECRET'),
    });
    const refreshToken = this.jwtService.sign(tokenPayload, {
      secret: this.configService.getOrThrow('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.getOrThrow('JWT_EXPIRATION'),
    });

    return { refreshToken, expires, accessToken };
  }

  verifyWs(request: Request): TokenPayload {
    const cookie: string[] = request.headers.cookie.split('; ');
    const authCookie = cookie.find((cookie) => cookie.includes('Authentication'));
    const jwt = authCookie.split('Authentication=')[1];
    const secretKey = this.configService.getOrThrow('JWT_REFRESH_SECRET');
    return this.jwtService.verify<TokenPayload>(jwt, {secret: secretKey});
  }

  logout(res: Response,) {
    res.cookie('Authentication', '', {
      httpOnly: true,
      expires: new Date(),
    });
  }
}
