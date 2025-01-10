import { ArrowLeft, ArrowRight } from "lucide-react";
import { addDays, format, formatISO } from "date-fns";
import { Button } from "@nextui-org/react";
import { subDays } from "date-fns";
import { useState } from "react";

interface WeekDatePickerProps {
  originalDate: Date;
  handleDateChange: (startDate: string, endDate: string) => void;
}

export const WeekDatePicker = ({
  handleDateChange,
  originalDate,
}: WeekDatePickerProps) => {
  const [date, setDate] = useState(originalDate);

  const handleWeekChange = (direction: "prev" | "next") => {
    const newDate = direction === "prev" ? subDays(date, 7) : addDays(date, 7);

    setDate(newDate);

    const startDate = formatISO(subDays(newDate, 1));
    const endDate = formatISO(addDays(newDate, 1));

    handleDateChange(startDate, endDate);
  };

  return (
    <div className="flex items-center gap-2">
      <Button onPress={() => handleWeekChange("prev")}>
        <ArrowLeft size={20} />
      </Button>

      <span className="text-sm font-medium">{format(date, "dd/MM/yyyy")}</span>

      <Button onPress={() => handleWeekChange("next")}>
        <ArrowRight size={20} />
      </Button>
    </div>
  );
};
