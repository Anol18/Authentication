
import api from "@/lib/dummy_apiClient";
export const fetchTodos = async () => {
  const res = await api.get("/auth/signin");
  console.log(res);
  return res.data;
};
