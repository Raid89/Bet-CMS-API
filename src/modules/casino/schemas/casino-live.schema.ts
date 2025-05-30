import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type CasinoLiveDocument = CasinoLive & Document;

@Schema({ collection: 'cls', timestamps: true })
export class CasinoLive {
  @Prop({ type: String, required: true })
  title!: string;

  @Prop({ type: String, required: true })
  gameCode!: string;

  @Prop({ type: String, required: true })
  image!: string;

  @Prop({ type: String, required: true })
  icon!: string;

  @Prop({ type: String, required: true, default: 'active' })
  state!: string;

  @Prop({ type: Date })
  date?: Date;

  @Prop({ type: Number })
  position?: number;
}

export const CasinoLiveSchema = SchemaFactory.createForClass(CasinoLive);
