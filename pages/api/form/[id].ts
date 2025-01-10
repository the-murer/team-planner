import { NextApiRequest, NextApiResponse } from "next";

import Form from "@/database/models/Form";
import dbConnect from "@/database/dbConnect";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const {
    query: { id: meetId, startDate, endDate },
    method,
  } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const forms = await Form.find({
          meetId,
          createdAt: { $gte: startDate, $lte: endDate },
        });

        if (!forms) return res.status(400).json({ success: false });

        res.status(200).json({ success: true, forms });
      } catch (error: any) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
