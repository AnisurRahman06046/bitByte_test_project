import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  //   create a user
  @Post('register')
  async createUser(@Body() payload: CreateUserDto) {
    const result = await this.authService.createUser(payload);
    return {
      message: 'User is created successfully',
      data: result,
    };
  }

  @Post('login')
  async login(@Body() payload: { email: string; password: string }) {
    const result = await this.authService.login(payload);
    return {
      message: 'User is logged in',
      data: result,
    };
  }
}
