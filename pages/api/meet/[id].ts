import { NextApiRequest, NextApiResponse } from "next";

import dbConnect from "@/database/dbConnect";
import Meet from "@/database/models/Meet";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const {
    query: { id, companyId },
    body,
    method,
  } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const meet = await Meet.findById(id);

        // if (meet.companyId !== companyId)
        //   return res.status(404).json({ success: false });

        if (!meet) return res.status(400).json({ success: false });

        res.status(200).json({ success: true, meet });
      } catch (error) {
        console.log("🚀 ~ error => ", error);
        res.status(400).json({ success: false });
      }
      break;

    case "PUT":
      try {
        const meet = await Meet.findByIdAndUpdate(id, body, {
          new: true,
        });

        if (meet.companyId !== body.companyId)
          return res.status(404).json({ success: false });

        if (!meet) return res.status(400).json({ success: false });

        res.status(200).json({ success: true, meet });
      } catch (error) {
        console.log("🚀 ~ error => ", error);
        res.status(400).json({ success: false });
      }
      break;

    case "DELETE":
      try {
        const deletedMeet = await Meet.deleteOne({ _id: id, companyId });

        if (!deletedMeet) return res.status(400).json({ success: false });

        res.status(200).json({ success: true, meet: deletedMeet });
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
