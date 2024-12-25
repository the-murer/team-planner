// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  name: string;
};

export default function Handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  console.log("🚀 ~ req => ", req.query);
  res.status(200).json({ name: "Funcionando" });
}
