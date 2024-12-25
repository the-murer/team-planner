import { NextApiRequest, NextApiResponse } from "next";

import Form from "@/database/models/Form";
import dbConnect from "@/database/dbConnect";

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
        const form = await Form.findById(id);

        if (form.companyId !== companyId)
          return res.status(404).json({ success: false });

        if (!form) return res.status(400).json({ success: false });

        res.status(200).json({ success: true, form });
      } catch (error: any) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case "POST":
      try {
        const formBody = JSON.parse(body);

        const form = await Form.create(formBody);

        res.status(200).json({ success: true, form });
      } catch (error: any) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case "PUT":
      try {
        const form = await Form.findByIdAndUpdate(id, body, {
          new: true,
        });

        if (form.companyId !== body.companyId)
          return res.status(404).json({ success: false });

        if (!form) return res.status(400).json({ success: false });

        res.status(200).json({ success: true, form });
      } catch (error: any) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case "DELETE":
      try {
        const deletedForm = await Form.deleteOne({ _id: id, companyId });

        if (!deletedForm) return res.status(400).json({ success: false });

        res.status(200).json({ success: true, form: deletedForm });
      } catch (error: any) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
