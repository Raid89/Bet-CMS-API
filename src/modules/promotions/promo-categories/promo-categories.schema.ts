import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({ collection: 'promotioncategories' })
export class PromotionCategories extends Document {
    @Prop({ required: true, type: String, unique: true })
    category!: string;

    @Prop({ required: false, type: Number })
    sort!: number;
}

export const PromoCategoriesSchema = SchemaFactory.createForClass(PromotionCategories);