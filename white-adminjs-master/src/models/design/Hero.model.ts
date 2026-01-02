import { model, Schema } from 'mongoose'

export interface IHero {
  image: string;
  order: number;
  available: boolean;
}

export const HeroSchema = new Schema<IHero>(
  {
    image: { type: 'String', required: true },
    order: { type: 'Number', required: true },
    available: { type: 'Boolean', required: false },
  },
  { timestamps: true },
)

export const Hero = model<IHero>('Hero', HeroSchema);