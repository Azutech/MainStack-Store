import {
  Controller,
  Get,
  Req,
  Body,
  Patch,
  Param,
  HttpStatus,
  HttpException,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/guard/jwt.guard';
import { User } from './entities/user.entity';
import { RolesGuard } from 'src/guard/roles.guard';
import { Roles } from '../decorators/role.decorators'; // Import the Roles decorator
import { Role } from '../utils/enum';
@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('allUsers')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async findAll(@Req() req: any) {
    // return this.usersService.findAll();
    try {
      const users = await this.usersService.findAll();
      return { message: 'All Users retrieved successful', statusCode: HttpStatus.OK, users };
    } catch (err: any) {
      throw new HttpException(
        err.response || err.message,
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async dashboard(@Req() req: any) {
    try {
      const user = await this.usersService.findOne(req.user.id);

      return { user, message: 'Welcome User', statusCode: HttpStatus.OK };
    } catch (err: any) {
      throw new HttpException(
        err.response || err.message,
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async adminDashboard(@Req() req: any) {
    try {
      const user = await this.usersService.findAdmin(req.user.id);

      return { user, message: 'Welcome Admin', statusCode: HttpStatus.OK };
    } catch (err: any) {
      throw new HttpException(
        err.response || err.message,
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete('remove')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async remove(@Req() req: any, @Query('id') id: string) {
    try {
      // Ensure that the `id` parameter is correctly passed and validated
      const deletedUser = await this.usersService.remove(id);

      if (!deletedUser) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      return {
        message: 'User successfully deleted',
        statusCode: HttpStatus.OK,
        data: deletedUser,
      };
    } catch (err: any) {
      // Improve error handling to ensure detailed messages are provided
      throw new HttpException(
        err.response || err.message,
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
