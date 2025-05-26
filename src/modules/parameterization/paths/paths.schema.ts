import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({collection: 'paths'})
export class Paths extends Document {
    @Prop({ required: true, type: String })
    name!: string;

    @Prop({ required: true, type: String })
    path!: string;
    
    @Prop({ required: true, type: Boolean, default: false })
    status!: boolean;
}

export const PathsSchema = SchemaFactory.createForClass(Paths);