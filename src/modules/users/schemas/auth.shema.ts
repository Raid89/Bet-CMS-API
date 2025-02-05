import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class User extends Document {
    @Prop({ required: true, type: String })
    username!: string;

    @Prop({ required: true, type: String })
    email!: string;

    @Prop({ required: true, type: String })
    password!: string;

    @Prop({ required: true, type: String, default: true })
    isactive!: boolean;

    @Prop({ required: true, type: Date, default: Date.now })
    register_date!: Date;

    @Prop({ required: true, type: String })
    rol!: string;
}

export const AuthSchema = SchemaFactory.createForClass(User);