import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ClCategoryVipDocument = ClCategoryVip & Document;

@Schema({ collection: 'clcategoryvips' })
export class ClCategoryVip {
  @Prop({ required: true })
  category!: string;

  @Prop({ required: true, default: 'active' })
  state!: string;

  @Prop({ required: false })
  date?: Date;

  @Prop()
  position?: number;
}

export const ClCategoryVipSchema = SchemaFactory.createForClass(ClCategoryVip);
