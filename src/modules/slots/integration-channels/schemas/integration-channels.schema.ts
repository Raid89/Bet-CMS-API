import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'integrationchannels' })
export class IntegrationChannelsDocument extends Document {
    @Prop({ required: true, type: String })
    integrationChannel!: string;
}

export const IntegrationChannelsSchema = SchemaFactory.createForClass(IntegrationChannelsDocument);