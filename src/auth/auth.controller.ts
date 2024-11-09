import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { Public } from './public.route';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Public()
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  //   create a user

  @Post('register')
  @ApiOperation({
    summary:
      'Create a user. By default the role is user. modify to admin from the database',
  })
  @ApiBody({
    schema: {
      example: {
        username: 'User',
        email: 'user@gmail.com',
        password: 'user123',
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'User is created successfully',
    schema: {
      example: {
        statusCode: 201,
        message: 'User is created successfully',
        data: {
          id: 3,
          username: 'User',
          email: 'user@gmail.com',
          role: 'user',
          createdAt: '2024-11-09T08:06:29.885Z',
        },
        timestamp: '2024-11-09T08:06:30.445Z',
      },
    },
  })
  async createUser(@Body() payload: CreateUserDto) {
    const result = await this.authService.createUser(payload);
    return {
      message: 'User is created successfully',
      data: result,
    };
  }

  @Post('login')
  @ApiOperation({
    summary:
      'Login user. Credentials for admin. email:"admin123@gmail.com", password:"admin12345',
  })
  @ApiBody({
    schema: {
      example: {
        email: 'user@gmail.com',
        password: 'user123',
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'User is logged in successfully',
    schema: {
      example: {
        statusCode: 201,
        message: 'User is logged in',
        data: {
          accessToken:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJhZG1pbjEyM0BnbWFpbC5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MzExNDA0MDEsImV4cCI6MTczMTE1ODQwMX0.vBAO4plCQjWo71xds4Syjus6FXhp_BWNZrNbMSPcKRE',
        },
        timestamp: '2024-11-09T08:20:01.454Z',
      },
    },
  })
  async login(@Body() payload: { email: string; password: string }) {
    const result = await this.authService.login(payload);
    return {
      message: 'User is logged in',
      data: result,
    };
  }
}
