import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from "mongoose";
import { PromotionCategories } from '../promo-categories/promo-categories.schema';

@Schema({collection: 'promos'})
export class Promotions extends Document {
    @Prop({ required: true, type: String })
    title!: string;

    @Prop({ required: true, type: String })
    short_desc!: string;
    
    @Prop({ required: true, type: String })
    html!: string;

    @Prop({ type: Date, inmutable: true, default: Date.now })
    date!: Date;
    
    @Prop({ required: true, type: Date })
    dateActivation!: Date;

    @Prop({ required: true, type: Date })
    dateDeactivated!: Date;

    @Prop({ required: false, type: MongooseSchema.Types.ObjectId, ref: 'User' })
    author!: any;

    @Prop({ required: false, type: MongooseSchema.Types.ObjectId, ref: 'PromotionCategories' })
    categoryId!: PromotionCategories;

    @Prop({ required: false, type: String })
    feature!: string;

    @Prop({ required: true, type: String })
    titulo!: string;

    @Prop({ required: true, type: String })
    alt!: string;
}

export const PromotionsSchema = SchemaFactory.createForClass(Promotions);