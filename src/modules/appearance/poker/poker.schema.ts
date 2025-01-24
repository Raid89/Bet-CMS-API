import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export enum PokerImageStates {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
}

@Schema()
export class PokerImages extends Document {
    @Prop({ required: false, type: String })
    path!: string;

    @Prop({ required: false, type: String })
    link!: string;

    @Prop({ required: false, type: Date })
    date!: Date;

    @Prop({ required: false, type: Number, default: 0 })
    position!: number;

    @Prop({ required: false, enum: PokerImageStates, default: PokerImageStates.INACTIVE })
    state!: string;

    @Prop({ required: false, type: String })
    titulo!: string;

    @Prop({ required: false, type: String })
    alt!: string;
}

export const PokerImagesSchema = SchemaFactory.createForClass(PokerImages);

@Schema()
export class PokerUrl extends Document {
    @Prop({ required: true, type: String })
    url!: string;

    @Prop({ required: true, type: Date })
    date!: Date;

    @Prop({ required: true, enum: PokerImageStates, default: PokerImageStates.INACTIVE })
    state!: PokerImageStates
}

export const PokerUrlSchema = SchemaFactory.createForClass(PokerUrl);