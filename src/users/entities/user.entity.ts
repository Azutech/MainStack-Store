import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Status } from 'src/utils/type';

@Schema()
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  phoneNumber: string;

  @Prop()
  verificationCode: string;

  @Prop({
    default: 'Active',
  })
  status: Status;
}

export const userSchema = SchemaFactory.createForClass(User);
