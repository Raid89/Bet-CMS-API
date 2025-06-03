import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type CasinoLiveDocument = CasinoLive & Document;

@Schema({ collection: 'clnds', timestamps: true })
export class CasinoLive {
  @Prop({ type: String, required: true })
  title!: string;

  @Prop({ type: String, required: true })
  gameCode!: string;

  @Prop({ type: String, required: true })
  integrationChannelCode!: string;

  @Prop({ type: MongooseSchema.Types.Mixed })
  category?: any;

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

  @Prop({ type: String, required: true })
  titulo!: string;

  @Prop({ type: String, required: true })
  alt!: string;

  @Prop({ type: String, required: true })
  gameId!: string;

  @Prop({ type: [String], required: false })
  tags?: string[];

  @Prop({ type: String, required: false })
  wGameDesc?: string;

  @Prop({ type: String, required: false })
  bannerDescription?: string;

  @Prop({ type: String, required: false })
  wGameTitle?: string;

  @Prop({ type: String, required: false })
  gDescSubtitle?: string;

  @Prop({ type: String, required: false })
  gDescText?: string;

  @Prop({ type: String, required: false })
  gDescTitle?: string;

  @Prop({ type: Boolean, required: true, default: false })
  microSite!: boolean;

  @Prop({ type: String, required: false })
  msBanner?: string;

  @Prop({ type: String, required: false })
  msBannerMod?: string;

  @Prop({ type: MongooseSchema.Types.Mixed, required: false })
  msIllustrative?: any;
}

export const CasinoLiveSchema = SchemaFactory.createForClass(CasinoLive);
