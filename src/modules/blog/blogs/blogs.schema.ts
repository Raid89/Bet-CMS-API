import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ collection: 'blogs' })
export class Blogs extends Document {
  @Prop({ required: true })
  title!: string;

  @Prop({ required: true })
  content!: string;

  @Prop({ default: () => new Date() })
  date!: Date;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  author!: Types.ObjectId;

  @Prop({ required: false })
  image?: string;

  @Prop({ default: false })
  isFeature!: boolean;
}

export const BlogsSchema = SchemaFactory.createForClass(Blogs);

