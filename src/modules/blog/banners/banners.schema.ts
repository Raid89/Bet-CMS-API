import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'banners2' })
export class Banners extends Document {
  @Prop({ required: true })
  title!: string;

  @Prop({ required: true })
  image!: string;

  @Prop({ required: false })
  link?: string;

  @Prop({ default: false })
  active!: boolean;

  @Prop({ default: () => new Date() })
  createdAt!: Date;
}

export const BannersSchema = SchemaFactory.createForClass(Banners);