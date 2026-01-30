import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto, UserRole } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService){}

  async create(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
    // Проверка существования пользователя
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });
  
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }
  
    // Хеширование пароля
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
  
    const user = await this.prisma.user.create({
      data: {
        email: createUserDto.email,
        firstName: createUserDto.firstName,
        lastName: createUserDto.lastName,
        passwordHash: hashedPassword, // ✅ Используй passwordHash
        role: createUserDto.role || UserRole.MANAGER, // По умолчанию MANAGER
      },
    });
  
    // Исключи passwordHash из ответа
    const { passwordHash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
