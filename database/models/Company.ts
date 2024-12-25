import mongoose from "mongoose";

export interface Companies extends mongoose.Document {
  name: string;
}

const CompanySchema = new mongoose.Schema<Companies>({
  name: {
    type: String,
    required: true,
  },
});

export default mongoose.models.Company ||
  mongoose.model<Companies>("Company", CompanySchema);
