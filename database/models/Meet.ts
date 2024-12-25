import mongoose from "mongoose";

interface Meets extends mongoose.Document {
  name: string;
  local?: string;
  timeOfDay?: string;
  weekDay?: string;
  form: mongoose.Document[];
  users: String[];
  squads: String[];
  companyId: string;
}

const MeetSchema = new mongoose.Schema<Meets>(
  {
    name: {
      type: String,
      required: true,
    },
    local: {
      type: String,
    },
    timeOfDay: {
      type: String,
    },
    weekDay: {
      type: String,
    },
    form: {
      type: [mongoose.Schema.Types.Mixed],
    },
    squads: {
      type: [String],
    },
    users: {
      type: [String],
    },
    companyId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.models.Meet ||
  mongoose.model<Meets>("Meet", MeetSchema);
