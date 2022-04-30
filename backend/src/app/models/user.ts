import { prop, getModelForClass, plugin } from '@typegoose/typegoose';
import mongooseUniqueValidator from 'mongoose-unique-validator';
import { Base } from './base';

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
}

export default getModelForClass(User);
