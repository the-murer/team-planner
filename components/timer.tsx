import React, { useEffect, useState } from "react";
import { Button } from "@nextui-org/react";
import { Clock } from "lucide-react";

export const Timer = () => {
  const [started, setStarted] = useState(false);
  const [time, setTime] = useState(0);

  useEffect(() => {
    let intervalId: any;

    if (started) {
      intervalId = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [started]);

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return !started && time === 0 ? (
    <Button
      className="ml-10 mt-2"
      radius="md"
      size="md"
      variant="faded"
      onClick={() => setStarted(true)}
    >
      <Clock size={20} />
      {" Iniciar reunião"}
    </Button>
  ) : (
    <Button
      className="ml-10 mt-2"
      radius="md"
      size="md"
      variant="faded"
      onClick={() => setStarted((prev) => !prev)}
    >
      <Clock size={20} />
      {formatTime(time)}
    </Button>
  );
};
