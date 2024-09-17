import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product, productsSchema } from './entities/product.entity';
import { JwtModule } from '@nestjs/jwt';


@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([{ name: Product.name, schema: productsSchema }]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRATION_DATE'), // Token will expire in 3 days
        },
      }),
      inject: [ConfigService],
    }),
  ],

  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
