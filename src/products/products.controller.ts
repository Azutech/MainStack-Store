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
  Req,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from 'src/guard/jwt.guard';

@Controller('api/v1/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post('createProduct')
  @UseGuards(JwtAuthGuard)
  async createProduct(
    @Body() createProductDto: CreateProductDto,
    @Req() req: any,
  ) {
    try {
      const createdBy = req.user?.name; // Adjust this according to your JWT payload structure

      if (!createdBy) {
        throw new HttpException(
          'User not authenticated',
          HttpStatus.UNAUTHORIZED,
        );
      }
      const result = await this.productsService.create(
        createProductDto,
        createdBy,
      );
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
  async findOne(@Query('productId') id: string) {
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
  @UseGuards(JwtAuthGuard)
  async updateProduct(
    @Query('productId') id: string,
    @Body() updateProductDto: UpdateProductDto,
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

  @Delete('deleteProduct')
  @UseGuards(JwtAuthGuard)
  async delete(@Query('productId') id: string) {
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
