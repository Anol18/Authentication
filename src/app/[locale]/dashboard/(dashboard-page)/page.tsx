"use client"
import DataTable from "@/components/common/TanstackTable";
import { Button } from "@/components/ui/button";
import { clientFetch } from "@/lib/clientFetch";
import { useMockDataQuery } from "@/services/mock/useMock";
import { ColumnDef } from "@tanstack/react-table";
import { Edit2Icon } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

// Example usage with sample data
interface Person {
  id: number;
  fName: string;
  lName: string;
  age: number;
  email: string;
  status: string;
}


export default function App() {
 
  const {data} = useMockDataQuery();
  console.log("data",data);
  
   const columns: ColumnDef<Person>[] = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        cell: ({ row }) => <div className="font-medium">{row.getValue('id')}</div>,
      },
      {
        accessorKey: 'fName',
        header: 'First Name',
        cell: ({ row }) => <div>{row.getValue('fName')}</div>,
      },
      {
        accessorKey: 'lName',
        header: 'Last Name',
        cell: ({ row }) => <div>{row.getValue('lName')}</div>,
      },
      {
        accessorKey: 'age',
        header: 'Age',
        cell: ({ row }) => <div>{row.getValue('age')}</div>,
      },
      {
        accessorKey: 'email',
        header: 'Email',
        cell: ({ row }) => <div className="text-blue-600">{row.getValue('email')}</div>,
      },
      {
        accessorKey: 'status',
        // header: 'Status',
        cell: ({ row }) => {
          const status = row.getValue('status') as string;
          return (
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                status === 'Active'
                  ? 'bg-green-100 text-green-800'
                  : status === 'Inactive'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}
            >
              {status}
            </span>
          );
        },
      },
       {
        accessorKey: 'Action',
        // header: 'Status',
        cell: ({row}) => {
          console.log("row,",row.id);
          
         
          return (
            <Link href={`/dashboard/data/update/${row.id}`}>
            <Button variant={"outline"}>
              <Edit2Icon/>
            </Button>
            </Link>
            
          );
        },
      },
    ],
    []
  );



  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Reusable TanStack Table Example</h1>
     <div className="flex justify-end px-2">
    <Link href={"/dashboard/data/add"}>
      <Button>Add Data</Button>
    </Link>
     </div>
      <DataTable
        data={data ||[]}
        columns={columns}
        enableSorting={true}
        enableFiltering={true}
        enablePagination={true}
        pageSize={10}
        className="shadow-lg"
      />
    </div>
  );
}