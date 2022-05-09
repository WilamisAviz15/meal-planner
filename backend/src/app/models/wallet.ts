import { getModelForClass, plugin, prop, Ref } from '@typegoose/typegoose';
import mongooseUniqueValidator from 'mongoose-unique-validator';
import { Base } from './base';
import { User } from './user';

@plugin(mongooseUniqueValidator)
export class Wallet extends Base<string> {
  @prop({ required: true, ref: () => User })
  user: Ref<User>;

  @prop({ required: true })
  balance: string = '0,00';

  @prop({ required: true })
  lastUpdate: Date = new Date();
}
export default getModelForClass(Wallet);
