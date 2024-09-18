import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber({}, { message: 'Price must be a valid number' }) // Custom error message for price validation
  @IsNotEmpty()
  price: number; // Make sure price is a number, not a string

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  brand: string;
}
