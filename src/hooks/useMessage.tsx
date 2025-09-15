"use client";

import { useToast } from "@/components/ui/use-toast";

const useMessage = () => {
  const { toast } = useToast();

  const showMessage = (message: string, type: "success" | "error" | "default" = "default") => {
    toast({
      title: type === "success" ? "Success" : type === "error" ? "Error" : "Notice",
      description: message,
      variant: type, // shadcn toast can support variants like 'default', 'destructive', etc.
    });
  };

  return { showMessage };
};

export default useMessage;
