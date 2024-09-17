import {
  Controller,
  HttpStatus,
  Query,
  NotFoundException,
  HttpException,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post('createProduct')
  async createProduct(@Body() createProductDto: CreateProductDto) {
    try {
      const result = await this.productsService.create(createProductDto);
      return {
        message: 'Products Created successfully',
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

  @Get('allProducts')
  async findAll() {
    try {
      const user = await this.productsService.findAll();
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException('Products not found', HttpStatus.NOT_FOUND);
      }
      throw new HttpException(
        'Failed to retrieve products',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('product')
  async findOne(@Query('id') id: string) {
    try {
      const user = await this.productsService.findOne(id);
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
      }
      throw new HttpException(
        'Failed to retrieve products',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put('updateProduct')
  async updateProduct(
    @Query('id') id: string,
    @Body() updateProductDto: UpdateProductDto
  ) {
    try {
      const result = await this.productsService.update(id, updateProductDto);
      return {
        message: 'Product updated successfully',
        statusCode: HttpStatus.OK,
        result,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to update product',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  

  @Delete('delete')
  async delete(@Query('id') id: string) {
    try {
      const user = await this.productsService.remove(id);
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
      }
      throw new HttpException(
        'Failed to retrieve products',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
