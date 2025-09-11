"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { clientFetch } from "@/lib/clientFetch";
import { useMockDataMutation } from "@/services/mock/useMock";
import { useRouter } from "next/navigation";
export const formSchema = z.object({
  fName: z
    .string()
    .min(1, "First Name is required")
    .max(50, "First Name must be less than 50 characters"),
  lName: z
    .string()
    .max(50, "last Name must be less than 50 characters")
    .optional(),
  age: z
    .string()
    .min(1, "Age is required")
    .max(200, "Age must be less than 200"),
  email: z.string().email("Invalid email format").optional().or(z.literal("")),
  status: z.string().min(1, "Status is required"),
});
export type FormData = z.infer<typeof formSchema>;
const AddForm = () => {
  const postMockData = useMockDataMutation()
   const router = useRouter()
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fName: "",
      lName: "",
      age: "",
      email: "",
      status: "Pending",
    },
  });
  const onSubmit = async (values: FormData) => {
   
    // console.log(values);
    // const response = await clientFetch("/mock-data", {
    //   method: "POST",
    //   body: JSON.stringify(values),
    // });
    // const data = await response.json();
    // console.log(data);
    postMockData.mutate({...values},{
      onSuccess: (data) => {
        console.log(data);
        router.back()
      },

      onError: (error) => {
        console.log(error);
      }
    })
  };
  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* {loginError && (
                <Alert variant="destructive">
                  <AlertDescription>{loginError}</AlertDescription>
                </Alert>
              )} */}
          {/* username */}
          <FormField
            control={form.control}
            name="fName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your First Name"
                    {...field}
                    // disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* password */}
          <FormField
            control={form.control}
            name="lName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your Last Name"
                    {...field}
                    // disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Age</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter your age"
                    {...field}
                    // disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter your email"
                    {...field}
                    // disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Status</SelectLabel>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* submit button */}
          <Button
            type="submit"
            className="w-full"

            // disabled={isLoading}
          >
            Add User
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AddForm;
