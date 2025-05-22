import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema({ collection: 'layouts' })
export class LayoutsDocument extends Document {
    @Prop({type: Number, required: true})
    idLayout!: number;

    @Prop({type: Boolean, required: false, default: false})
    isFeature!: boolean

    @Prop({type: [mongoose.Schema.Types.Mixed], required: true, ref: 'Image'})
    images!: mongoose.Schema.Types.Mixed[];

    @Prop({type: Date, default: new Date()})
    date!: Date;

    @Prop({type: Date, required: true, default: new Date()})
    activationDate!: Date; 
}

export const LayoutsSchema = SchemaFactory.createForClass(LayoutsDocument);