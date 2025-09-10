"use client";

import { fetchData } from "@/actions/example";
import { Button } from "@/components/ui/button";

import { signOut } from "next-auth/react";
import { useEffect } from "react";

const SignOut = () => {
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <Button onClick={() => signOut()}>SignOut</Button>
    </div>
  );
};

export default SignOut;
