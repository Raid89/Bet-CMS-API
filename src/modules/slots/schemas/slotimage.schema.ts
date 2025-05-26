import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SlotimageDocument = Slotimage & Document;

@Schema({ collection: 'slotimages' })
export class Slotimage {
  @Prop({ type: String })
  path?: string;

  @Prop({ type: String })
  name?: string;
}

export const SlotimageSchema = SchemaFactory.createForClass(Slotimage);
