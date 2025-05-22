import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'images' })
export class ImageDocument extends Document {
    @Prop({type: Date, default: Date.now})
    date!: Date;

    @Prop({type: String})
    path!: string;

    @Prop({type: String})
    link!: string;

    @Prop({type: String})
    titulo!: string;
    
    @Prop({type: String})
    alt!: string;
}
export const ImageSchema = SchemaFactory.createForClass(ImageDocument);