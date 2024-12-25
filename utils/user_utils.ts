import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

import { Company } from "@/types";

const SECRET_KEY = process.env.SECRET_KEY || "secreto";
const REFRESH_SECRET_KEY = process.env.REFRESH_SECRET_KEY || "secreto";

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

export const verifyUserToken = (token: string) => {
  try {
    const { user } = jwt.verify(token, SECRET_KEY) as { user: any };

    return user;
  } catch (error) {
    console.log("🚀 ~ error => ", error);

    return null;
  }
};

export const assembleUserObject = (user: any) => {
  const { name, email, companies } = user;

  return {
    _id: user._id.toString(),
    name,
    email,
    companies,
  };
};

export const generateToken = (user: any) =>
  jwt.sign(user, SECRET_KEY, { expiresIn: "30m" });

export const generateRefreshToken = (user: any) =>
  jwt.sign(user, REFRESH_SECRET_KEY, { expiresIn: "15d" });
