import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema({ collection: 'banneresports' })
export class BannerESportsDocument extends Document {
    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Image'})
    images!: mongoose.Schema.Types.ObjectId;

    @Prop({type: Date})
    dateActivation!: Date;

    @Prop({type: Date})
    dateDeactivated!: Date;

    @Prop({type: Date})
    date!: Date;

    @Prop({type: Number})
    type!: number;
}
export const BannerESportsSchema = SchemaFactory.createForClass(BannerESportsDocument);