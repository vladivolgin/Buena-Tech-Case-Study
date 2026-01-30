// src/users/dto/create-user.dto.ts
import { 
    IsEmail, 
    IsString, 
    IsOptional, 
    MinLength, 
    IsEnum,
    IsNotEmpty 
  } from 'class-validator';
  
  // Используй enum из Prisma схемы
  export enum UserRole {
    MANAGER = 'MANAGER',
    ACCOUNTANT = 'ACCOUNTANT',
    ADMIN = 'ADMIN',
  }
  
  export class CreateUserDto {
    @IsEmail({}, { message: 'Please provide a valid email address' })
    @IsNotEmpty({ message: 'Email is required' })
    email: string;
  
    @IsOptional() // ✅ firstName опциональный в схеме
    @IsString({ message: 'First name must be a string' })
    @MinLength(2, { message: 'First name must be at least 2 characters long' })
    firstName?: string;
  
    @IsOptional() // ✅ lastName опциональный в схеме
    @IsString({ message: 'Last name must be a string' })
    @MinLength(2, { message: 'Last name must be at least 2 characters long' })
    lastName?: string;
  
    @IsString({ message: 'Password must be a string' })
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    password: string;
  
    @IsOptional()
    @IsEnum(UserRole, { 
      message: 'Role must be MANAGER, ACCOUNTANT, or ADMIN' 
    })
    role?: UserRole;
  }
  