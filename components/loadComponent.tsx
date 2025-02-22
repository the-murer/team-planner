import { Loader2 } from "lucide-react";
import React from "react";

export const LoadComponent = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex flex-col justify-center items-center">
        <h1 className="text-2xl font-bold">Carregando...</h1>
        <Loader2 className="w-10 h-10 animate-spin" />
      </div>
    </div>
  );
};
