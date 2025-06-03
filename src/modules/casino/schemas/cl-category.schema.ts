import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ClCategoryDocument = ClCategory & Document;

@Schema()
export class ClCategory {
  @Prop({ type: String, required: true })
  category!: string;

  @Prop({ type: String, required: true, default: 'active' })
  state!: string;

  @Prop({ type: Date, required: false })
  date?: Date;

  @Prop({ type: Number })
  position?: number;
}

export const ClCategorySchema = SchemaFactory.createForClass(ClCategory);
