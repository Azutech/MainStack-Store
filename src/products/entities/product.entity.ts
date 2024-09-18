import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as moment from 'moment';

@Schema()
export class Product extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  description: string;

  @Prop()
  brand: string; // Change 'Brand' to 'brand' for consistency

  @Prop()
  createdBy: string;

  @Prop({
    default: moment.utc().toDate(), // Use Moment.js to get the current UTC date
  })
  date: Date; // Correct the type to be Date
}

export const productsSchema = SchemaFactory.createForClass(Product);
