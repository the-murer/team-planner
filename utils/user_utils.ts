import bcrypt from "bcrypt";
import mongoose from "mongoose";

import { Company } from "@/types";

export async function generateUserCreatePayload(
  user: any,
  company: Company,
  isAdmin: boolean,
) {
  const companies = [
    {
      name: company.name,
      companyId: company._id,
      isAdmin,
    },
  ];

  const passwordHash = await bcrypt.hash(user.password, 10);

  return {
    _id: new mongoose.Types.ObjectId(),
    ...user,
    password: passwordHash,
    companies,
  };
}

export const assembleUserObject = (user: any) => {
  const { name, email, companies } = user;

  return {
    _id: user._id.toString(),
    name,
    email,
    companies,
  };
};
