import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CLIntegrationChannelCodesDocument = CLIntegrationChannelCodes & Document;

@Schema()
export class CLIntegrationChannelCodes {
  @Prop({ type: String, required: true })
  integrationChannelCode!: string;

  @Prop({ type: String, required: true, default: 'active' })
  state!: string;

  @Prop({ type: Date, required: false })
  date?: Date;
}

export const CLIntegrationChannelCodesSchema = SchemaFactory.createForClass(CLIntegrationChannelCodes);
