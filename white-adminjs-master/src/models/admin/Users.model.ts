import { model, Schema } from 'mongoose'

export interface IUsers {
  name: string;
  email: string;
  role: string;
  authorized: boolean
}

export const UsersSchema = new Schema<IUsers>(
  {
    name: { type: 'String', required: true },
    email: { type: 'String', required: true },
    role: { type: 'String', required: true },
    authorized: { type: 'Boolean', required: false },
  },
  { timestamps: true },
)

export const Users = model<IUsers>('Users', UsersSchema);