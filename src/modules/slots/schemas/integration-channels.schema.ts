import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type IntegrationChannelDocument = IntegrationChannel & Document;

@Schema({ collection: 'integrationchannels' })
export class IntegrationChannel {
  @Prop({ type: String })
  integrationChannel?: string;
}

export const IntegrationChannelSchema = SchemaFactory.createForClass(IntegrationChannel);
