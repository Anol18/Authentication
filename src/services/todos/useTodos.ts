import { useQuery } from "@tanstack/react-query"
import { fetchTodos } from "./todoApi"

export const useTodos = () => {
  return useQuery({
    queryKey: ["todos"],
    queryFn:fetchTodos, 
    staleTime: 1000 * 60 * 5,
    placeholderData: (previousData) => previousData,
  })
}
