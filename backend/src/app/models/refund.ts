import { prop, getModelForClass, plugin, Ref } from '@typegoose/typegoose';
import mongooseUniqueValidator from 'mongoose-unique-validator';
import { Base } from './base';
import { Schedule } from './schedule';
import { User } from './user';

@plugin(mongooseUniqueValidator)
export class Refund extends Base<string> {
  @prop({ required: true, ref: () => User })
  user: Ref<User>;

  @prop({ required: true, ref: () => Schedule })
  schedule: Ref<Schedule>;

  @prop({ required: true })
  mealType!: string;

  @prop({ required: true })
  value!: string;

  @prop({ required: true })
  status: string = 'pendente';

  @prop({ required: true })
  lastUpdate: Date = new Date();
}

export default getModelForClass(Refund);
