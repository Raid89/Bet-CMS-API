import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ collection: 'videos' })
export class Videos extends Document {
  @Prop({ required: true })
  title!: string;

  @Prop({ required: true })
  description!: string;

  @Prop({ required: false })
  file!: string; // Path al archivo si es video subido

  @Prop({ required: false })
  youtubeId?: string; // ID de YouTube si es externo

  @Prop({ required: false })
  preview?: string;

  @Prop({ default: () => new Date() })
  date!: Date;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  author!: Types.ObjectId;

  @Prop({ default: true })
  active!: boolean;
}

export const VideosSchema = SchemaFactory.createForClass(Videos);