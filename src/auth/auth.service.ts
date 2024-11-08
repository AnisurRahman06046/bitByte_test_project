import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

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
}
