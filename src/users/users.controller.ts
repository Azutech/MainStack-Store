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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/guard/jwt.guard';
import { User } from './entities/user.entity';
JwtAuthGuard;

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async dashboard(@Req() req: any): Promise<User> {
    try {
      const user = await this.usersService.findOne(req.user.id);

      return user
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

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
