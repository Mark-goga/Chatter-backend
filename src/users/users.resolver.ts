import {Args, Mutation, Query, Resolver} from '@nestjs/graphql';
import {UsersService} from './users.service';
import {User} from './entities/user.entity';
import {CreateUserInput} from './dto/create-user.input';
import {UpdateUserInput} from './dto/update-user.input';
import {BadRequestException, UseGuards} from '@nestjs/common';
import {CurrentUser} from '../auth/current-user.decorator';
import {TokenPayload} from '../auth/token-payload.interface';
import {JwtAccessAuthGuard} from '../auth/guards/jwt-access-auth.guard';

@Resolver(() => User)
export class UsersResolver {
	constructor(private readonly usersService: UsersService) {
	}

	@Mutation(() => User)
	async createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
		const existUser = await this.usersService.findOneByEmail(createUserInput.email);
		if (existUser) {
			throw new BadRequestException('User already exists');
		}
		return this.usersService.create(createUserInput);
	}

	@Query(() => [User], {name: 'users'})
	@UseGuards(JwtAccessAuthGuard)
	findAll(
	) {
		return this.usersService.findAll();
	}

	@Query(() => User, {name: 'user'})
	@UseGuards(JwtAccessAuthGuard)
	findOne(@Args('_id') _id: string) {
		return this.usersService.findOne(_id);
	}

	@Mutation(() => User)
	@UseGuards(JwtAccessAuthGuard)
	updateUser(
		@Args('updateUserInput') updateUserInput: UpdateUserInput,
		@CurrentUser() user: TokenPayload,
	) {
		return this.usersService.update(user._id, updateUserInput);
	}

	@Mutation(() => User)
	@UseGuards(JwtAccessAuthGuard)
	removeUser(@CurrentUser() user: TokenPayload) {
		return this.usersService.remove(user._id);
	}
}
