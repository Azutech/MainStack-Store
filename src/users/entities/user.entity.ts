import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Status, Role } from 'src/utils/enum';

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

  @Prop()
  isVerified: boolean;

  @Prop()
  role: Role;

  @Prop({
    default: Status.INACTIVE,
  })
  status: Status;
}

export const userSchema = SchemaFactory.createForClass(User);
