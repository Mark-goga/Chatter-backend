import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { TokenPayload } from '../token-payload.interface';

@Injectable()
export class JwtAccessStrategy {
  constructor(private readonly jwtService: JwtService,) {}

  validateToken(request: Request, secretKey: string): TokenPayload {
    const token = this.extractToken(request);
    if (!token) {
      throw new UnauthorizedException('Token not found');
    }
    try {
      return this.jwtService.verify<TokenPayload>(token, { secret: secretKey });
    } catch (err) {
      throw new UnauthorizedException(err);
    }
  }

  private extractToken(request: Request ): string | undefined {
    const authHeader = request.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.split(' ')[1];
    }
  }
}
