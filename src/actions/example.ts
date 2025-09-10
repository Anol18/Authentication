"use server";
import { apiFetch } from "@/lib/apiClient";

export const fetchData = async () => {
  const res = await apiFetch("/auth/signin");
  const data = await res.json();
  console.log(data);
};
