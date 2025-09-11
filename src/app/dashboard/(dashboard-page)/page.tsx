"use client"
import DataTable from "@/components/common/TanstackTable";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { useMemo } from "react";

// Example usage with sample data
interface Person {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  email: string;
  status: string;
}

const sampleData: Person[] = [
  { id: 1, firstName: 'John', lastName: 'Doe', age: 30, email: 'john@example.com', status: 'Active' },
  { id: 2, firstName: 'Jane', lastName: 'Smith', age: 25, email: 'jane@example.com', status: 'Active' },
  { id: 3, firstName: 'Bob', lastName: 'Johnson', age: 35, email: 'bob@example.com', status: 'Inactive' },
  { id: 4, firstName: 'Alice', lastName: 'Williams', age: 28, email: 'alice@example.com', status: 'Active' },
  { id: 5, firstName: 'Charlie', lastName: 'Brown', age: 32, email: 'charlie@example.com', status: 'Pending' },
  { id: 6, firstName: 'Diana', lastName: 'Davis', age: 27, email: 'diana@example.com', status: 'Active' },
  { id: 7, firstName: 'Eve', lastName: 'Miller', age: 29, email: 'eve@example.com', status: 'Inactive' },
  { id: 8, firstName: 'Frank', lastName: 'Wilson', age: 31, email: 'frank@example.com', status: 'Active' },
  { id: 9, firstName: 'Grace', lastName: 'Moore', age: 26, email: 'grace@example.com', status: 'Pending' },
  { id: 10, firstName: 'Henry', lastName: 'Taylor', age: 33, email: 'henry@example.com', status: 'Active' },
  { id: 11, firstName: 'Ivy', lastName: 'Anderson', age: 24, email: 'ivy@example.com', status: 'Active' },
  { id: 12, firstName: 'Jack', lastName: 'Thomas', age: 36, email: 'jack@example.com', status: 'Inactive' },
];

export default function App() {
  const columns: ColumnDef<Person>[] = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        cell: ({ row }) => <div className="font-medium">{row.getValue('id')}</div>,
      },
      {
        accessorKey: 'firstName',
        header: 'First Name',
        cell: ({ row }) => <div>{row.getValue('firstName')}</div>,
      },
      {
        accessorKey: 'lastName',
        header: 'Last Name',
        cell: ({ row }) => <div>{row.getValue('lastName')}</div>,
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
    ],
    []
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Reusable TanStack Table Example</h1>
     <div className="flex justify-end px-2">
    <Link href={"/dashboard/add-data"}>
      <Button>Add Data</Button>
    </Link>
     </div>
      <DataTable
        data={sampleData}
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