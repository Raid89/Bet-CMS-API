import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BannerClVipDocument = BannerClVip & Document;

@Schema({ collection: 'bannerclvips' })
export class BannerClVip {
  @Prop()
  path?: string;

  @Prop()
  date?: Date;

  @Prop()
  sort?: number;

  @Prop()
  titulo?: string;

  @Prop()
  alt?: string;
}

export const BannerClVipSchema = SchemaFactory.createForClass(BannerClVip);
