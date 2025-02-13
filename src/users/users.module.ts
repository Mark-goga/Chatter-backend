import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { UsersRepository } from './users.repository';
import { DatabaseModule } from '../common/database/database.module';
import { User, UserEntity } from './entities/user.entity';
import { AuthModule } from '../auth/auth.module';
import { UsersController } from './users.controller';
import {S3Module} from "../common/s3/s3.module";

@Module({
  imports: [
    S3Module,
    DatabaseModule.forFeature([{ name: User.name, schema: UserEntity }]),
    forwardRef(() => AuthModule)
    // AuthModule,
  ],
  providers: [UsersResolver, UsersService, UsersRepository],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
