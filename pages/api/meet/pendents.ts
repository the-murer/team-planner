"use session";
import { NextApiRequest, NextApiResponse } from "next";
import { addDays, differenceInDays, subDays } from "date-fns";

import dbConnect from "@/database/dbConnect";
import Meet from "@/database/models/Meet";
import Form from "@/database/models/Form";

const weekDays = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
];

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
        const today = new Date();
        const todayDayOfWeek = today.getDay();

        const meets = await Meet.find({ users: { $in: [id] } }).lean();

        const meetsIds = meets.map((meet) => meet._id);

        const forms = await Form.find({
          meetId: { $in: meetsIds },
          $or: [
            { createdAt: { $gte: subDays(new Date(), 6) } },
            { createdAt: { $exists: false } },
          ],
        });

        const pendentMeets = meets
          .filter((meet) => meet.weekDay >= todayDayOfWeek)
          .map((meet) => {
            const { weekDay: weekDayNumber } = meet;

            const daysUntilMeet =
              weekDayNumber >= todayDayOfWeek
                ? weekDayNumber - todayDayOfWeek
                : 7 - (todayDayOfWeek - weekDayNumber);

            const meetDate = addDays(today, daysUntilMeet);

            const form = forms.find(
              (form) => form.meetId === meet._id!.toString(),
            );

            const isPending =
              !form || differenceInDays(meetDate, form.createAt) > 6;

            return {
              ...meet,
              meetDate,
              isPending,
              weekDay: weekDays[parseInt(meet.weekDay)],
            };
          });

        res.status(200).json({ success: true, meets: pendentMeets });
      } catch (error: any) {
        res.status(400).json({ success: false, error: error.message });
      }
    default:
      res.status(400).json({ success: false });
      break;
  }
}
