import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {

  constructor(private readonly usersRepository: UsersRepository) {
  }

  async bcryptPassword(password: string) {
    return await bcrypt.hash(password, 10);
  }

  async create(createUserInput: CreateUserInput) {
    return this.usersRepository.create({
      ...createUserInput,
      password: await this.bcryptPassword(createUserInput.password),
    });
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
