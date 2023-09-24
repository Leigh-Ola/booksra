import {
  Controller,
  Get,
  Put,
  Post,
  Body,
  Request,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from './users.service';
import { User } from './user.entity';
import {
  CreateUserDto,
  LoginUserDto,
  UpdateUserDto,
  UserChangePasswordDto,
  UserResetPasswordDto,
} from './dto/users-dto';
import { IsUser } from './users-guard';

@Controller('user')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  // get user
  @Get()
  @UseGuards(IsUser)
  async findOne(@Request() req): Promise<Partial<User>> {
    const id = req.user.id;
    const user = await this.usersService.getUser({ id });
    if (!user) {
      throw new NotFoundException('User does not exist');
    } else {
      return user;
    }
  }

  // update user
  @Put()
  @UseGuards(IsUser)
  async update(@Request() req, @Body() user: UpdateUserDto) {
    const id = req.user.id;
    return this.usersService.updateUser(id, user);
  }

  // register user
  @Post('/register')
  async create(@Body() user: CreateUserDto) {
    return this.usersService.create(user);
  }

  // login user
  @Post('/login')
  async login(@Body() user: LoginUserDto) {
    return this.usersService.login(user);
  }

  // change password
  @Put('/begin-change-password')
  async sendPasswordToken(@Body() body: UserChangePasswordDto) {
    return this.usersService.sendPasswordToken(body.email);
  }

  // reset password
  @Put('/finish-change-password')
  async resetPassword(@Body() body: UserResetPasswordDto) {
    return this.usersService.resetPassword(body);
  }
}
