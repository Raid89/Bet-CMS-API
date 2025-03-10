import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({collection: 'banners'})
export class PromoBanners extends Document {
    @Prop({ type: Date, inmutable: true, default: Date.now })
    date!: Date;
    
    @Prop({ required: true, type: String })
    titulo!: string;

    @Prop({ required: true, type: String })
    alt!: string;

    @Prop({ required: false, type: Number, default: 0 })
    sort!: number;

    @Prop({ required: false, type: String })
    path!: string;
}

export const PromoBannersSchema = SchemaFactory.createForClass(PromoBanners);