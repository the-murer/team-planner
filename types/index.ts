import { SVGProps } from "react";
import { Types } from "mongoose";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type User = {
  _id: Types.ObjectId;
  name: string;
  email: string;
  passwordHash: string;
  companys: string[];
};

export type Meet = {
  _id: Types.ObjectId;
  name: string;
  timeOfDay: string;
  weekDay: string;
  local: string;
  userId: string;
  companyId: string;
  form: any[];
  users: string[];
  squads: string[];
};

export type Company = {
  _id: Types.ObjectId;
  name: string;
};
