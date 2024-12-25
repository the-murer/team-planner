import mongoose from "mongoose";

interface Forms extends mongoose.Document {
  name: string;
  squad: string;
  answers: mongoose.Document[];
  userId: string;
  meetId: string;
  companyId: string;
}

const FormSchema = new mongoose.Schema<Forms>(
  {
    name: {
      type: String,
      required: true,
    },
    squad: {
      type: String,
      required: true,
    },
    answers: {
      type: [mongoose.Schema.Types.Mixed],
      required: true,
    },
    userId: {
      type: String,
      required: false,
    },
    meetId: {
      type: String,
      required: true,
    },
    companyId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.models.Form ||
  mongoose.model<Forms>("Form", FormSchema);
