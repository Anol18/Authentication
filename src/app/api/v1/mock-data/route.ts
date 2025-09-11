import { z } from "zod";

import { NextResponse, type NextRequest } from "next/server";
import {
  FormData,
  formSchema,
} from "@/app/[locale]/dashboard/data/add/components/AddForm";

// generate unique id
const generateUniqueId = () => {
  return Math.random().toString(36).substring(2, 9);
};
type UserData = FormData & { id: string };
const userData: UserData[] = [
  {
    id: "1",
    fName: "John",
    lName: "Doe",
    age: "30",
    email: "john@example.com",
    status: "Active",
  },
  {
    id: "2",
    fName: "Jane",
    lName: "Smith",
    age: "25",
    email: "jane@example.com",
    status: "Active",
  },
  {
    id: "3",
    fName: "Bob",
    lName: "Johnson",
    age: "35",
    email: "bob@example.com",
    status: "Inactive",
  },
  {
    id: "4",
    fName: "Alice",
    lName: "Williams",
    age: "28",
    email: "alice@example.com",
    status: "Active",
  },
  {
    id: "5",
    fName: "Charlie",
    lName: "Brown",
    age: "32",
    email: "charlie@example.com",
    status: "Pending",
  },
  {
    id: "6",
    fName: "Diana",
    lName: "Davis",
    age: "27",
    email: "diana@example.com",
    status: "Active",
  },
];
// import { getApiToken } from "@/lib/getApiToken";
// import { serverFetch } from "@/lib/serverFetch";

export async function POST(req: NextRequest) {
  const body: FormData = await req.json();
  userData.push({
    id: generateUniqueId(),
    ...body,
  });
  return NextResponse.json({ data: userData[userData.length - 1] });
}

export async function GET() {
  return NextResponse.json({ data: userData });
}

export async function PUT(req: NextRequest) {
  const body: UserData = await req.json();
  const { id, age, fName, status, email, lName } = body;

  userData.forEach((user) => {
    if (user.id === id) {
      user.age = age;
      user.fName = fName;
      user.status = status;
      user.email = email;
      user.lName = lName;
    }
  });
  return NextResponse.json({ data: userData });
}
