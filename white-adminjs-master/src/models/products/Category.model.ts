import { model, Schema } from 'mongoose'

export interface ICategory {
  category: string;
  available: boolean;
}

export const CategorySchema = new Schema<ICategory>(
  {
    category: { type: 'String', required: true },
    available: { type: 'Boolean', required: false },
  },
  { timestamps: true },
)

export const Category = model<ICategory>('Category', CategorySchema);