import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Welcome to Main STack CART!! \n Dope inventory on display 🖥️ ';
  }
}
