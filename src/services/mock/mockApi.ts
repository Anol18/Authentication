import { FormData } from "@/app/[locale]/dashboard/data/add/components/AddForm";
import { clientFetch } from "@/lib/clientFetch";

export const fetchMockData = async () => {
  const response = await clientFetch("/mock-data");
  const data = await response.json();
  return data?.data || [];
};
export const addMockData = async (body:FormData) => {
  const response = await clientFetch("/mock-data",
    {
      method: "POST",
      body: JSON.stringify(body)
    }
  );
  const data = await response.json();
  return data?.data || [];
};



export const updateMockData = async ({id,body}:{id:string,body:FormData}) => {
  const response = await clientFetch(`/mock-data/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(body)
    }
  );
  const data = await response.json();
  return data?.data || [];
};



export const fetchMockDataById = async (id:string) => {
  const response = await clientFetch(`/mock-data/${id}`);
  const data = await response.json();
  return data?.data || [];
};