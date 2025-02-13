import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';


@Schema({ collection: 'tags' })
export class TagDocument extends Document {
    @Prop({ required: true, type: String, unique: true })
    tag!: string;

    @Prop({ type: String, required: false })
    description!: string;
}

export const TagsSchema = SchemaFactory.createForClass(TagDocument);
