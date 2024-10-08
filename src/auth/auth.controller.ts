import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginUserDto } from '../users/dto/login-user.dto';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      const result = await this.authService.create(createUserDto);
      return {
        message: 'User Created successfully',
        statusCode: HttpStatus.CREATED,
        result,
      };
    } catch (error) {
      // Rethrow the error with the original status code and message
      throw new HttpException(
        error.response || error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('login')
  async loginUser(@Body() loginUserDto: LoginUserDto) {
    try {
      const user = await this.authService.login(loginUserDto);

      const token = await this.authService.generateToken(user);

      return {
        message: 'Login successful',
        statusCode: HttpStatus.OK,
        user,
        token,
      };
    } catch (error) {
      // Rethrow the error with the original status code and message
      throw new HttpException(
        error.response || error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('activateAccount')
  async activate(@Query('vericationCode') verication_code: string) {
    try {
      const activatedUser =
        await this.authService.accountActivation(verication_code);
      return {
        message: 'Account Activated Successfully',
        statusCode: HttpStatus.OK,
        activatedUser,
      };
    } catch (error) {
      throw new HttpException(
        error.response || error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
