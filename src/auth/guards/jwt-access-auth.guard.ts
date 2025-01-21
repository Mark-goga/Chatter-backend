import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { JwtAccessStrategy } from '../strategies/jwt-access.strategy';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class JwtAccessAuthGuard implements CanActivate {
  constructor(
    private readonly jwtStrategy: JwtAccessStrategy,
    private readonly configService: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = this.getRequest(context);

    const secretKey = this.configService.getOrThrow('JWT_ACCESS_SECRET');
    const user = this.jwtStrategy.validateToken(request, secretKey);

    request.user = user;
    return true;
  }

  private getRequest(context: ExecutionContext): Request {
    if (context.getType() === 'http') {
      return context.switchToHttp().getRequest<Request>();
    }else if (context.getType<GqlContextType>() === 'graphql') {
      return GqlExecutionContext.create(context).getContext().req;
    }
    throw new Error('Unsupported context type');
  }
}