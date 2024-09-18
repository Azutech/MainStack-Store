import {
  Injectable,
  ConflictException,
  HttpException,
  UnauthorizedException,
  NotFoundException,
  HttpStatus,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../users/entities/user.entity';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginUserDto } from '../users/dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { Role, Status } from 'src/utils/enum';

// import { UpdateAuthDto } from './dto/update-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const { name, email, password, phoneNumber } = createUserDto;

    const user = await this.userModel.findOne({ email });

    if (user) {
      throw new ConflictException('User with this email already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = uuidv4();
    const createdUser = new this.userModel({
      name,
      email,
      phoneNumber,
      role: Role.USER,
      verificationCode,
      password: hashedPassword,
      isVerified: false,
    });

    if (!createdUser) {
      throw new HttpException('Users can not created', HttpStatus.BAD_REQUEST);
    }
    return createdUser.save();
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  async generateToken(user: User): Promise<string> {
    const payload = {
      id: user._id, // user._id or user.id (depending on how your user schema is set)
      email: user.email,
      name: user.name, // Ensure that these fields exist on the user object
      phoneNumber: user.phoneNumber,
      status: user.status,
      role: user.role,
    };
    return this.jwtService.sign(payload);
  }

  async login(loginUserDto: LoginUserDto): Promise<any> {
    const { email, password } = loginUserDto;

    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new NotFoundException('User with this email does not exist');
    }

    if (user.status === 'Inactive') {
      throw new UnauthorizedException('User is inactive');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Wrong Password');
    }

    const userObject = user.toObject();

    // Remove the password from the response object
    delete userObject.password;

    return userObject;
  }

  async accountActivation(code: string): Promise<any> {
    const findCode = await this.userModel.findOne({ verificationCode: code });

    if (!findCode) {
      throw new NotFoundException('Verification Code not found');
    }

    const findUser = await this.userModel.findById(findCode?._id);

    if (!findUser) {
      throw new HttpException('User does not exist', HttpStatus.BAD_REQUEST);
    }

    const verifiedUser = await this.userModel.findOneAndUpdate(
      { _id: findUser._id },
      { $set: { status: Status.ACTIVE }, $unset: { verificationCode: 1 } }, // Remove the 'token' field
      { new: true },
    );

    if (!verifiedUser) {
      throw new HttpException('Unable to verify User ', HttpStatus.BAD_REQUEST);
    }

    return {
      message: 'Account activated successfully',
      user: {
        isVerified: true,
        status: Status.ACTIVE,
      },
    };
  }
}
