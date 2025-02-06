import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'bannernlots' })
export class BannerSlotsDocument extends Document {
    @Prop({ type: String })
    path!: string;

    @Prop({ type: Date })
    date!: Date

    @Prop({ type: String })
    titulo!: string;
    
    @Prop({ type: String })
    alt!: string;

    @Prop({ type: String })
    destinationUrl!: string;

    @Prop({ type: Number })
    sort!: number;

}

export const BannerSlotsSchema = SchemaFactory.createForClass(BannerSlotsDocument);