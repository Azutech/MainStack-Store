import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../users/entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from 'src/utils/enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    // private readonly jwtService: JwtService,
  ) {}

  async findAll(): Promise<User[]> {
    const user = await this.userModel.find({}).exec();

    if (user.length === 0) {
      throw new NotFoundException('User Not Found');
    }

    return user;
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findOne({ _id: id }).exec();

    if (!user) {
      throw new NotFoundException('User Not Found');
    }

    return user;
  }

  async findAdmin(id: string): Promise<User> {
    const adminUser = await this.userModel
      .findOne({ _id: id, role: Role.ADMIN })
      .exec();

    if (!adminUser) {
      console.error(`Admin with ID ${id} not found`);
      throw new NotFoundException(`Admin with ID ${id} not found`);
    }

    return adminUser;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async remove(id: string) {
    const user = await this.userModel.findOneAndDelete({ _id: id }).exec();

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }
}
