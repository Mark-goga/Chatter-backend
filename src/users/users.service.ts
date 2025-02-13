import {Injectable, UnauthorizedException, UnprocessableEntityException} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { UsersRepository } from './users.repository';
import {S3Service} from "../common/s3/s3.service";
import {USERS_BUCKET, USERS_IMAGE_FILE_EXTENSION} from "./users.constants";

@Injectable()
export class UsersService {

  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly s3Service: S3Service,
  ) {
  }

  async bcryptPassword(password: string) {
    return await bcrypt.hash(password, 10);
  }

  async create(createUserInput: CreateUserInput) {
    try {
      return await this.usersRepository.create({
        ...createUserInput,
        password: await this.bcryptPassword(createUserInput.password),
      });
    }catch (e) {
      if (e.message.includes(`E11000`)) {
        throw new UnprocessableEntityException('User already exists');
      }
      throw e;
    }
  }

  async findAll() {
    return this.usersRepository.find({});
  }

  async findOne(_id: string) {
    return this.usersRepository.findOne({ _id }, 'User');
  }

  async findOneByEmail(email: string) {
    return this.usersRepository.findOneWithoutThrowError({ email });
  }

  async update(_id: string, updateUserInput: UpdateUserInput) {
    if (updateUserInput.password) {
      updateUserInput.password = await this.bcryptPassword(updateUserInput.password);
    }
    return await this.usersRepository.findOneAndUpdate({ _id }, {
      $set: {
        ...updateUserInput,
      },
    });
  }

  async uploadImage(file: Buffer, userId: string) {
    const bucket = USERS_BUCKET;
    await this.s3Service.upload({
      key: `${userId}.${USERS_IMAGE_FILE_EXTENSION}`,
      bucket,
      file,
    })
  }

  async remove(_id: string) {
    return this.usersRepository.findOneAndDelete({ _id });
  }

  async verifyUser(email: string, password: string) {
    const user = await this.usersRepository.findOneWithoutThrowError({ email });
    if (!user) {
      throw new UnauthorizedException('Invalid password or email');
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw new UnauthorizedException('Invalid password or email');
    }
    return user;
  }

}
