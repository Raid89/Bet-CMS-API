import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

@Schema({ collection: 'slots' })
export class SlotsDocument extends Document {
  @Prop({ type: String, required: true })
  title!: string;

  @Prop({ type: Date, required: false })
  date!: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User" })
  author!: mongoose.Schema.Types.ObjectId;

  @Prop({ type: String })
  feature!: string;

  @Prop({ type: String, required: true })
  integrationChannelCode!: string;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  category!: any;

  @Prop({ type: String })
  roules!: string;

  @Prop({ type: String, required: true })
  gameCode!: string;

  @Prop({ type: String, required: true })
  gameId!: string;

  @Prop({ type: String, required: true })
  buttonText!: string;

  @Prop({ type: String })
  additionalParam!: string;

  @Prop({ type: String, default: "active" })
  state!: string;

  @Prop({ type: Boolean, default: false })
  isSisplay!: boolean;

  @Prop({ type: Boolean, required: true })
  flashClient!: boolean;

  @Prop({ type: String })
  urlDemo!: string;

  @Prop({ type: String })
  typeDemoGameUrl!: string;

  @Prop({ type: Number })
  sort!: number;

  @Prop({ type: String, required: true })
  titulo!: string;

  @Prop({ type: String, required: true })
  alt!: string;

  @Prop({ type: [String], required: false })
  tags!: string[];

  @Prop({ type: String, required: false })
  wGameDesc!: string;

  @Prop({ type: String, required: false })
  wGameTitle!: string;

  @Prop({ type: String, required: false })
  bannerDescription!: string;

  @Prop({ type: String, required: false })
  gDescSubtitle!: string;

  @Prop({ type: String, required: false })
  gDescText!: string;

  @Prop({ type: String, required: false })
  gDescTitle!: string;

  @Prop({ type: mongoose.Schema.Types.Mixed, required: false, default: false })
  microSite!: boolean;

  @Prop({ type: String, required: false })
  msBanner!: string;

  @Prop({ type: String, required: false })
  msBannerMod!: string;

  @Prop({ type: mongoose.Schema.Types.Mixed, required: false })
  msIllustrative!: any;
}

export const SlotSchema = SchemaFactory.createForClass(SlotsDocument);