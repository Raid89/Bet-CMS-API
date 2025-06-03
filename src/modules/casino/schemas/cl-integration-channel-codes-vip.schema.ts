import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ClIntegrationChannelCodesVipDocument = ClIntegrationChannelCodesVip & Document;

@Schema({ collection: 'clintegrationchannelcodesvips' })
export class ClIntegrationChannelCodesVip {
  @Prop({ required: true })
  integrationChannelCode!: string;

  @Prop({ required: true, default: 'active' })
  state!: string;

  @Prop({ required: false })
  date?: Date;
}

export const ClIntegrationChannelCodesVipSchema = SchemaFactory.createForClass(ClIntegrationChannelCodesVip);
