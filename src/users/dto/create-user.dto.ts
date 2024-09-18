import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Validate,
  IsStrongPassword,
} from 'class-validator';
import { IsDomainConstraint } from 'src/utils/emailValidators';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  @Validate(IsDomainConstraint, [
    '.com',
    '.co.uk',
    '.ng',
    '.org',
    'co.za',
    'net',
    '.africa',
  ], {
    
      message: 'The email domain must be one of the following: .com, .co.uk, .ng, .org, co.za, net, .africa',
   
  },) // Specify the allowed domain(s)
  email: string;

  @IsString()
  @IsNotEmpty()
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message:
        'Password is not strong enough. It must have at least 8 characters, including 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.',
    },
  )
  password: string;

  @IsString()
  phoneNumber: string;
}
