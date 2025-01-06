import React from "react";

interface NotFoundComponentProps {
  message: string;
}

export const NotFoundComponent = ({ message }: NotFoundComponentProps) => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex flex-col justify-center items-center">
        <h1 className="text-2xl font-bold">{message}</h1>
      </div>
    </div>
  );
};
