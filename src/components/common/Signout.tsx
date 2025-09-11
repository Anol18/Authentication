"use client";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import React from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Button } from "../ui/button";

const Signout = ({label}:{label?:string}) => {
  return (
    <button onClick={() => signOut()}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" className="flex gap-1 items-center">
            {" "}
            <LogOut className="text-red-600" />
            <span className="text-red-600">{label ? label : ""}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Sign Out</p>
        </TooltipContent>
      </Tooltip>
    </button>
  );
};

export default Signout;
