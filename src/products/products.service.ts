import {
  Injectable,
  HttpException,
  NotFoundException,
  HttpStatus,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}
  async create(createProductDto: CreateProductDto, createdBy: string ) {
    const { name, price, description, brand,  } = createProductDto;

    const createProducts = new this.productModel({
      name,
      price,
      description,
      brand,
      createdBy
    });

    if (!createProducts) {
      throw new HttpException(
        'Products can not created',
        HttpStatus.BAD_REQUEST,
      );
    }
    return createProducts.save();
  }

  async findAll(): Promise<Product[]> {
    const product = await this.productModel.find({}).exec();

    if (product.length === 0) {
      throw new NotFoundException('Product Not Found');
    }

    return product;
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productModel.findOne({ _id: id }).exec();

    if (!product) {
      throw new NotFoundException('Product Not Found');
    }

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    try {
      const updatedProduct = await this.productModel.findByIdAndUpdate(
        id,
        { $set: updateProductDto }, // Update the product with the new data
        { new: true, runValidators: true } // Return the updated document and apply validation
      ).exec();
  
      if (!updatedProduct) {
        throw new NotFoundException('Product not found');
      }
  
      return updatedProduct;
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to update product',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
  

  async remove(id: string) {
    const product = await this.productModel
      .findByIdAndDelete({ _id: id })
      .exec();

    if (!product) {
      throw new NotFoundException('Product Not Found');
    }

    return product;
  }
}
