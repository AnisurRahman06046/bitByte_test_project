import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async createUser(payload: CreateUserDto) {
    // check if the user is existed associated with the email
    const { username, email, password } = payload;
    const isUserExist = await this.prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    // if user is exists , throw error
    if (isUserExist) {
      throw new BadRequestException('User is already exist');
    }

    // hash the password
    const salt = 10;
    const hashed_password = await bcrypt.hash(password, salt);

    const result = await this.prisma.user.create({
      data: {
        username: username,
        email: email,
        password: hashed_password,
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
    return result;
  }

  // login user
  async login(payload: { email: string; password: string }) {
    const user = await this.prisma.user.findFirst({
      where: {
        email: payload.email,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // compare the password
    const isPasswordMatched = await bcrypt.compare(
      user.password,
      payload.password,
    );
    if (isPasswordMatched) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // generate access token
    const jwtPayload = { id: user.id, email: user.email, role: user.role };

    const accessToken = await this.jwtService.signAsync(jwtPayload, {
      expiresIn: process.env.JWT_EXPIRES_IN,
      secret: process.env.JWT_SECRET,
    });
    return {
      accessToken: accessToken,
    };
  }
}
