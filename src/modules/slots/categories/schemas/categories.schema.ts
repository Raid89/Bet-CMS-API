import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'slotscategories' })
export class CategoriesDocument extends Document {
    @Prop({ required: true, type: String })
    title!: string;

    @Prop({ type: Date, default: new Date().getTime() })
    date!: Date;

    @Prop({ type: String, default: '-' })
    label = '-';

    @Prop({ type: Number, default: 100 })
    sort = 100;
}

export const CategoriesSchema = SchemaFactory.createForClass(CategoriesDocument);