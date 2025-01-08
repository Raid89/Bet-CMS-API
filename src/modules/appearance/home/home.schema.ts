import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export enum HomeImagesValidTypes {
    SELECCION = 'SELECCION',
    DIMAYOR = 'DIMAYOR',
    PAYMENT_METHOD = 'PAYMENT_METHOD',
}

@Schema()
export class HomeImages extends Document {
    @Prop({ required: false, type: String })
    path!: string;

    @Prop({ required: true, type: String, enum: HomeImagesValidTypes })
    type!: HomeImagesValidTypes; 

    @Prop({ required: true, type: String })
    link!: string;

    @Prop({ required: false, type: String })
    titleImg!: string;

    @Prop({ required: false, type: String })
    altImg!: string;

    @Prop({ required: false, type: Date })
    date!: Date;

    @Prop({ required: false, type: Number, default: 0 })
    sort!: number;

    @Prop({ required: false, type: String, default: 'inactive' })
    state!: string;

    @Prop({ required: false, type: String })
    title!: string;

    @Prop({ required: false, type: String })
    alt!: string;
}

export const HomeImagesSchema = SchemaFactory.createForClass(HomeImages);