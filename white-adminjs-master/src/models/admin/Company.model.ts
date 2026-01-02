import { model, Schema } from 'mongoose'

export interface ICompany {
  logo: string;
  address: string;
  link: string;
  name: string;
  email: string;
  owner: string
}

export const CompanySchema = new Schema<ICompany>(
  {
    logo: { type: 'String', required: true },
    address: { type: 'String', required: true },
    link: { type: 'String', required: false },
    name: { type: 'string', required: true },
    email: { type: 'string', required: true },
    owner: { type: 'string', required: true}
  },
  { timestamps: true },
)

export const Company = model<ICompany>('Company', CompanySchema);