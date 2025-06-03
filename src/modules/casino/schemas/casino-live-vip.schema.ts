import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type CasinoLiveVipDocument = CasinoLiveVip & Document;

@Schema({ collection: 'clndvips' })
export class CasinoLiveVip {
  @Prop({ required: true })
  title!: string;

  @Prop({ required: true })
  gameCode!: string;

  @Prop({ required: true })
  integrationChannelCode!: string;

  @Prop({ type: MongooseSchema.Types.Mixed, ref: 'ClcategoryVip', required: true })
  category!: any;

  @Prop({ required: true })
  image!: string;

  @Prop({ required: true })
  icon!: string;

  @Prop({ required: true, default: 'active' })
  state!: string;

  @Prop({ required: false })
  date?: Date;

  @Prop()
  position?: number;

  @Prop({ required: true })
  titulo!: string;

  @Prop({ required: true })
  alt!: string;

  @Prop({ required: true })
  gameId!: string;
}

export const CasinoLiveVipSchema = SchemaFactory.createForClass(CasinoLiveVip);
