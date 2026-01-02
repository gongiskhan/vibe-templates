import { model, Schema } from 'mongoose'

export interface IRole {
  role: string;
  available: boolean;
}

export const RoleSchema = new Schema<IRole>(
  {
    role: { type: 'String', required: true },
    available: { type: 'Boolean', required: false },
  },
  { timestamps: true },
)

export const Role = model<IRole>('Role', RoleSchema);