import { NextApiRequest, NextApiResponse } from "next";

import Company from "@/database/models/Company";
import User from "@/database/models/User";
import dbConnect from "@/database/dbConnect";
import { generateUserCreatePayload } from "@/utils/user_utils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "PATCH":
      try {
        const { userId } = JSON.parse(req.body);

        const user = await User.findById(userId);

        if (!user) return res.status(400).json({ success: false });

        const users = await User.find({
          "companies.companyId": { $in: user.companies[0].companyId },
        });

        res.status(200).json({ success: true, users });
      } catch (error: any) {
        console.log("🚀 ~ error => ", error);
        res.status(400).json({ success: false });
      }
      break;
    case "POST":
      try {
        const body = JSON.parse(req.body);

        const { companyId, isAdmin } = body;

        const company = await Company.findById(companyId);

        if (!company) return res.status(400).json({ success: false });

        const user = await generateUserCreatePayload(body, company, isAdmin);

        await User.create(user);

        res.status(200).json({
          success: true,
        });
      } catch (error: any) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
