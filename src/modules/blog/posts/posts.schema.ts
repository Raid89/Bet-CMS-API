import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ collection: 'posts' })
export class Posts extends Document {
  @Prop({ required: true })
  title!: string;

  @Prop({ required: true })
  subtitle!: string;

  @Prop({ required: true })
  pageTitle!: string;

  @Prop({ required: true })
  shortDescription!: string;

  @Prop({ required: true })
  html!: string;

  @Prop({ required: false })
  image!: string;

  @Prop()
  imageDescription?: string;

  @Prop({ type: [String] })
  tags?: string[];

  @Prop({ default: false })
  isFeature!: boolean;

  @Prop({ default: () => new Date() })
  date!: Date;

  @Prop({ default: 0 })
  programedDate?: number;

  @Prop({ default: 0 })
  views!: number;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  author!: Types.ObjectId;

  @Prop({ default: 'inactive' })
  state!: string;

  @Prop({ type: Types.ObjectId, ref: 'Categories' })
  categoryId!: Types.ObjectId;

  @Prop()
  titulo?: string;

  @Prop()
  alt?: string;

  @Prop()
  formattedTitle?: string;
}

export const PostsSchema = SchemaFactory.createForClass(Posts);