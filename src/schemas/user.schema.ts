import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ timestamps: true })
export class User {
    @Prop({ required: true, unique: true })
    username: string;
    @Prop({ required: true })
    age: number
}

export const UserSchema = SchemaFactory.createForClass(User)