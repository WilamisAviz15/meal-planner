import { getModelForClass, plugin, prop, Ref } from '@typegoose/typegoose';
import mongooseUniqueValidator from 'mongoose-unique-validator';
import { Base } from './base';
import { User } from './user';

@plugin(mongooseUniqueValidator)
export class Schedule extends Base<string> {
  @prop({ required: true, ref: () => User })
  user: Ref<User>;

  @prop({ required: true })
  mealType: string = '';

  @prop({ required: true })
  mealDate!: Date;

  @prop()
  isDone: boolean = false;
}

export default getModelForClass(Schedule);
