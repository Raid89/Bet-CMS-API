import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CategoryDocument = Category & Document;

@Schema({ collection: 'slotscategories' })
export class Category {
  @Prop({ type: String, required: true })
  title!: string;

  @Prop({ type: Date, default: Date.now })
  date?: Date;

  @Prop({ type: String, required: false, default: '-' })
  label?: string;

  @Prop({ type: Number, default: 100 })
  sort?: number;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
