import { Module } from '@nestjs/common';
import { ConfigModule , ConfigService} from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {MongooseModule } from '@nestjs/mongoose'


@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
      expandVariables: true,
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule], // Import ConfigModule to use ConfigService
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'), // Get MongoDB URI from environment variables
      }),
      inject: [ConfigService], // Inject ConfigService into the factory function
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
