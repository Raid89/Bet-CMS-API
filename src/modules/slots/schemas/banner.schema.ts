import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BannerDocument = Banner & Document;

@Schema({ collection: 'bannerslots' })
export class Banner {
  @Prop({ type: String })
  path?: string;

  @Prop({ type: Date })
  date?: Date;

  @Prop({ type: Number })
  sort?: number;

  @Prop({ type: String })
  alt?: string;

  @Prop({ type: String })
  titulo?: string;

  @Prop({ type: String })
  destinationUrl?: string;
}

export const BannerSchema = SchemaFactory.createForClass(Banner);
