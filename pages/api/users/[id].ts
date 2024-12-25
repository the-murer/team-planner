import { NextApiRequest, NextApiResponse } from "next";

import dbConnect from "@/database/dbConnect";
import User from "@/database/models/User";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const {
    query: { id },
    method,
  } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const user = await User.findById(id);

        if (!user) return res.status(400).json({ success: false });

        res.status(200).json({ success: true, user });
      } catch (error) {
        console.log("🚀 ~ error => ", error);
        res.status(400).json({ success: false });
      }
      break;

    case "PUT":
      try {
        const user = await User.findByIdAndUpdate(id, req.body, {
          new: true,
        });

        if (!user) return res.status(400).json({ success: false });

        res.status(200).json({ success: true, user });
      } catch (error) {
        console.log("🚀 ~ error => ", error);
        res.status(400).json({ success: false });
      }
      break;

    case "DELETE":
      try {
        const deletedUser = await User.deleteOne({ _id: id });

        if (!deletedUser) return res.status(400).json({ success: false });

        res.status(200).json({ success: true, user: deletedUser });
      } catch (error) {
        console.log("🚀 ~ error => ", error);
        res.status(400).json({ success: false });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
