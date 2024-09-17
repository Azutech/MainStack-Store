import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {
    
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber({}, { message: 'Price must be a valid number' })  // Custom error message for price validation
  @IsNotEmpty()
  price: number;  

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  brand: string;

}

