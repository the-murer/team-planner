import mongoose, { Types } from "mongoose";

interface UserCompany extends Types.Subdocument {
  name: string;
  companyId: string;
  isAdmin: boolean;
}

export interface Users extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  companies: UserCompany[];
}

const UserSchema = new mongoose.Schema<Users>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  companies: {
    type: [
      {
        companyId: String,
        name: String,
        isAdmin: Boolean,
      },
    ],
    required: true,
  },
});

export default mongoose.models.User ||
  mongoose.model<Users>("User", UserSchema);
