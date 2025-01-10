import { ArrowLeft, ArrowRight } from "lucide-react";
import { addDays, format, formatISO, startOfWeek } from "date-fns";
import { Button } from "@nextui-org/react";
import { subDays } from "date-fns";
import { useEffect } from "react";

import { Meet } from "@/types";

interface WeekDatePickerProps {
  currentDate?: Date;
  setCurrentDate: (date: Date) => void;
  handleDateChange: (startDate: string, endDate: string) => void;
  meet: Meet;
}

export const WeekDatePicker = ({
  handleDateChange,
  currentDate,
  setCurrentDate,
  meet,
}: WeekDatePickerProps) => {
  useEffect(() => {
    if (!meet) return;

    const currentDate = addDays(
      startOfWeek(new Date()),
      parseInt(meet.weekDay!),
    );

    setCurrentDate(currentDate);

    const date = new Date(currentDate);

    const startDate = formatISO(subDays(date, 4));
    const endDate = formatISO(addDays(date, 1));

    handleDateChange(startDate, endDate);
  }, [meet]);

  const handleWeekChange = (direction: "prev" | "next") => {
    const newDate =
      direction === "prev"
        ? subDays(currentDate!, 7)
        : addDays(currentDate!, 7);

    setCurrentDate(newDate);

    const startDate = formatISO(subDays(newDate, 4));
    const endDate = formatISO(addDays(newDate, 1));

    handleDateChange(startDate, endDate);
  };

  if (!currentDate) return null;

  return (
    <div className="flex items-center gap-2">
      <Button onPress={() => handleWeekChange("prev")}>
        <ArrowLeft size={20} />
      </Button>

      <span className="text-sm font-medium">
        {format(currentDate, "dd/MM/yyyy")}
      </span>

      <Button onPress={() => handleWeekChange("next")}>
        <ArrowRight size={20} />
      </Button>
    </div>
  );
};
