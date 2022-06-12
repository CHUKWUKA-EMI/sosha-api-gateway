import { HttpCode, Logger, UseFilters, UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { AllRPCExceptionsFilter } from 'all-rpc-exceptions-filter';
import { lastValueFrom } from 'rxjs';
import {
  CreateUserInput,
  PasswordChange,
  RetrieveUserPayload,
  UpdateUserInput,
  User,
  Users,
} from 'src/graphql';
import { AuthGuard } from './auth.guard';
import { UsersService } from './users.service';

const logger = new Logger('UsersResolver');

@Resolver('User')
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @UseFilters(new AllRPCExceptionsFilter())
  @Mutation('createUser')
  @HttpCode(201)
  async create(@Args('createUserInput') createUserInput: CreateUserInput) {
    try {
      return await lastValueFrom(this.usersService.create(createUserInput));
    } catch (error) {
      logger.error('error', error);
      return new Error(error.error);
    }
  }

  @UseGuards(AuthGuard)
  @UseFilters(new AllRPCExceptionsFilter())
  @Query('getAllUsers')
  @HttpCode(200)
  async getAllUsers(@Args('page') page: number, @Args('limit') limit: number) {
    try {
      return (await lastValueFrom(
        this.usersService.findAll(page, limit),
      )) as Users;
    } catch (error) {
      logger.error('error', error);
      return new Error(error.error);
    }
  }

  @UseGuards(AuthGuard)
  @UseFilters(new AllRPCExceptionsFilter())
  @Query('getUserByName')
  @HttpCode(200)
  async getUserByName(
    @Args('username') username: string,
    @Args('token') token: string,
  ) {
    try {
      return (await lastValueFrom(
        this.usersService.findByUserName(username, token),
      )) as User;
    } catch (error) {
      logger.error('error', error);
      return new Error(error.error);
    }
  }

  @UseFilters(new AllRPCExceptionsFilter())
  @Query('retrieveUser')
  @HttpCode(200)
  async retrieveUser(@Args('payload') payload: RetrieveUserPayload) {
    try {
      return (await lastValueFrom(
        this.usersService.retrieveUser(payload),
      )) as User;
    } catch (error) {
      logger.error('error', error);
      return new Error(error.error);
    }
  }

  @UseGuards(AuthGuard)
  @UseFilters(new AllRPCExceptionsFilter())
  @Query('user')
  @HttpCode(200)
  async findOne(@Args('id') id: string) {
    try {
      return (await lastValueFrom(this.usersService.findOne(id))) as User;
    } catch (error) {
      logger.error('error', error);
      return new Error(error.error);
    }
  }

  @UseGuards(AuthGuard)
  @UseFilters(new AllRPCExceptionsFilter())
  @Mutation('updateProfile')
  @HttpCode(200)
  async update(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    try {
      return (await lastValueFrom(
        this.usersService.update(updateUserInput),
      )) as User;
    } catch (error) {
      logger.error('error', error);
      return new Error(error.error);
    }
  }

  @UseFilters(new AllRPCExceptionsFilter())
  @Mutation('login')
  @HttpCode(200)
  async login(
    @Args('email') email: string,
    @Args('password') password: string,
  ) {
    try {
      return await lastValueFrom(this.usersService.login(email, password));
    } catch (error) {
      logger.error(error);
      return new Error(error.error);
    }
  }

  @UseGuards(AuthGuard)
  @UseFilters(new AllRPCExceptionsFilter())
  @HttpCode(200)
  @Mutation('logout')
  async logout(
    @Args('userId') userId: string,
    @Args('refreshToken') refreshToken: string,
  ) {
    try {
      return await lastValueFrom(
        this.usersService.logout(userId, refreshToken),
      );
    } catch (error) {
      logger.error(error);
      throw new Error(error.error);
    }
  }

  @UseFilters(new AllRPCExceptionsFilter())
  @Mutation('requestPasswordReset')
  @HttpCode(200)
  async requestPasswordReset(@Args('email') email: string) {
    try {
      return await lastValueFrom(this.usersService.requestPasswordReset(email));
    } catch (error) {
      logger.error(error);
      throw new Error(error.error);
    }
  }

  @UseFilters(new AllRPCExceptionsFilter())
  @Mutation('resetPassword')
  @HttpCode(200)
  async resetPassword(@Args('email') email: string) {
    try {
      return await lastValueFrom(this.usersService.resetPassword(email));
    } catch (error) {
      logger.error(error);
      throw new Error(error.error);
    }
  }

  @UseFilters(new AllRPCExceptionsFilter())
  @Mutation('resetPassword')
  @HttpCode(200)
  async changePassword(@Args('payload') payload: PasswordChange) {
    try {
      return await lastValueFrom(this.usersService.changePassword(payload));
    } catch (error) {
      logger.error(error);
      throw new Error(error.error);
    }
  }

  @UseGuards(AuthGuard)
  @UseFilters(new AllRPCExceptionsFilter())
  @Mutation('removeUser')
  @HttpCode(200)
  async remove(@Args('id') id: string) {
    try {
      return (await lastValueFrom(this.usersService.remove(id))) as User;
    } catch (error) {
      logger.error(error);
      throw new Error(error.error);
    }
  }
}
