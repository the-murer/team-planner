import { NextApiRequest, NextApiResponse } from "next";

import dbConnect from "@/database/dbConnect";
import Form from "@/database/models/Form";

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
        const forms = await Form.find({ meetId: id });

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
