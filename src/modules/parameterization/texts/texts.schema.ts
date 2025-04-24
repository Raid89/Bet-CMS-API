import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'texts' })
export class Texts extends Document {
  @Prop({ required: false })
  json?: string;

  @Prop({ required: false, default: false })
  date?: string;
}

export const TextsSchema = SchemaFactory.createForClass(Texts);