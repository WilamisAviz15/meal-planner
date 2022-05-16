import { prop, getModelForClass, plugin } from '@typegoose/typegoose';
import mongooseUniqueValidator from 'mongoose-unique-validator';
import { Base } from './base';

export class Refund extends Base<string> {
  @prop({ required: true })
  mealType: string = '';

  @prop({ required: true })
  value: string = '';

  @prop({ required: true })
  status: string = 'pendente';

  @prop({ required: true })
  lastUpdate: Date = new Date();
}

@plugin(mongooseUniqueValidator)
export class User extends Base<string> {
  @prop({ required: true })
  cpf: string = '';

  @prop({ required: true })
  name: string = '';

  @prop({ required: true })
  mail: string = '';

  @prop({ required: true })
  password: string = '';

  @prop()
  isAdmin: boolean = false;

  @prop({ type: () => [Refund] })
  refunds: Refund[] = [];
}

export default getModelForClass(User);
