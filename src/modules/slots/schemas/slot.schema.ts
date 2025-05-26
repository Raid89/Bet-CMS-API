import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type SlotDocument = Slot & Document;

@Schema({ collection: 'slots' })
export class Slot {
  @Prop({ type: String, required: true })
  title!: string;

  @Prop({ type: Date })
  date?: Date;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  author?: MongooseSchema.Types.ObjectId;

  @Prop({ type: String })
  feature?: string;

  @Prop({ type: String, required: true })
  integrationChannelCode!: string;

  @Prop({ type: MongooseSchema.Types.Mixed })
  category?: any;

  @Prop({ type: String })
  roules?: string;

  @Prop({ type: String, required: true })
  gameCode!: string;

  @Prop({ type: String, required: true })
  gameId!: string;

  @Prop({ type: String, required: true })
  buttonText!: string;

  @Prop({ type: String })
  additionalParam?: string;

  @Prop({ type: String, default: 'active' })
  state?: string;

  @Prop({ type: Boolean, default: false })
  isSisplay?: boolean;

  @Prop({ type: Boolean, required: true })
  flashClient!: boolean;

  @Prop({ type: String })
  urlDemo?: string;

  @Prop({ type: String })
  typeDemoGameUrl?: string;

  @Prop({ type: Number })
  sort?: number;

  @Prop({ type: String, required: true })
  titulo!: string;

  @Prop({ type: String, required: true })
  alt!: string;

  @Prop({ type: [String] })
  tags?: string[];

  @Prop({ type: String })
  wGameDesc?: string;

  @Prop({ type: String })
  wGameTitle?: string;

  @Prop({ type: String })
  bannerDescription?: string;

  @Prop({ type: String })
  gDescSubtitle?: string;

  @Prop({ type: String })
  gDescText?: string;

  @Prop({ type: String })
  gDescTitle?: string;

  @Prop({ type: Boolean, required: true })
  microSite!: boolean;

  @Prop({ type: String })
  msBanner?: string;

  @Prop({ type: String })
  msBannerMod?: string;

  @Prop({ type: MongooseSchema.Types.Mixed })
  msIllustrative?: any;
}

export const SlotSchema = SchemaFactory.createForClass(Slot);
