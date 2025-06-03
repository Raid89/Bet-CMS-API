import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BannerCLDocument = BannerCL & Document;

@Schema()
export class BannerCL {
  @Prop({ type: String })
  path?: string;

  @Prop({ type: Date })
  date?: Date;

  @Prop({ type: Number })
  sort?: number;

  @Prop({ type: String })
  titulo?: string;

  @Prop({ type: String })
  alt?: string;

  @Prop({ type: String })
  destinationUrl?: string;
}

export const BannerCLSchema = SchemaFactory.createForClass(BannerCL);
