import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { UsersModule } from '../users/users.module';
import { JwtAccessStrategy } from './strategies/jwt-access.strategy';
import { JwtAccessAuthGuard } from './guards/jwt-access-auth.guard';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    // UsersModule,
    // JwtModule.registerAsync({
    //   useFactory: (configService: ConfigService) => ({
    //     secret: configService.getOrThrow('JWT_REFRESH_SECRET'),
    //     signOptions: {
    //       expiresIn: Number(configService.getOrThrow('JWT_EXPIRATION')),
    //     }
    //   }),
    //   inject: [ConfigService]
    // }),
    JwtModule.register({}),
  ],
  providers: [AuthService, LocalStrategy, JwtRefreshStrategy, JwtAccessStrategy, JwtAccessAuthGuard],
  controllers: [AuthController],
  exports: [JwtAccessAuthGuard, JwtAccessStrategy],
})
export class AuthModule {}
