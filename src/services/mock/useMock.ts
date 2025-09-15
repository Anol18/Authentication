import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addMockData,
  fetchMockData,
  fetchMockDataById,
  updateMockData,
} from "./mockApi";
import { FormData } from "@/app/[locale]/dashboard/data/add/components/AddForm";

export const useMockDataQuery = () => {
  return useQuery({
    queryKey: ["mock-data"],
    queryFn: () => fetchMockData(),

    staleTime: 1000 * 60 * 5,
    placeholderData: (previousData) => previousData,
  });
};

export const useMockDataMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: FormData) => addMockData(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mock-data"] });
    },
  });
};

export const useUpdateMockDataMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: FormData }) =>
      updateMockData({ id, body }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mock-data"] });
    },
  });
};

export const useMockDataByIdQuery = (id: string) => {
  return useQuery({
    queryKey: ["single-data"],
    queryFn: () => fetchMockDataById(id),

    staleTime: 1000 * 60 * 5,
    placeholderData: (previousData) => previousData,
  });
};
