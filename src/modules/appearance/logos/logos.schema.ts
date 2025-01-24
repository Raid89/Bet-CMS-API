import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Logos extends Document {
  @Prop({ required: false, type: String })
  path!: string;

  @Prop({ required: true, default: 1 })
  type!: number;

  @Prop()
  titleImg!: string;

  @Prop()
  altImg!: string;

  @Prop({ default: false })
  date!: string;

  @Prop({ default: false })
  isCurrent!: boolean;

  @Prop({ default: '' })
  titulo!: string;

  @Prop({ default: '' })
  alt!: string;
}

export const LogosSchema = SchemaFactory.createForClass(Logos);

export enum SlideType {
  SPORTS = 'SPORTS',
  CASINO = 'CASINO',
  SLOTS = 'SLOTS',
  VIRTUALES = 'VIRTUALES',
}

@Schema()
export class Slides extends Document {
  @Prop()
  path!: string;

  @Prop({ enum: SlideType, required: true })
  type!: SlideType;

  @Prop()
  titleImg!: string;

  @Prop()
  altImg!: string;

  @Prop({ default: false })
  date!: string;

  @Prop({ default: 'active' })
  state!: string;

  @Prop()
  titulo!: string;

  @Prop()
  alt!: string;
}

export const SlidesSchema = SchemaFactory.createForClass(Slides);
