import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class Applications extends Document {
    @Prop({ required: true, type: String })
    path!: string;

    @Prop({ required: true, type: String })
    version!: string;

    @Prop({ required: true, type: Boolean, default: false })
    active!: boolean;

    @Prop({ required: true, type: Date})
    date!: Date;
}

export const ApplicationsSchema = SchemaFactory.createForClass(Applications);