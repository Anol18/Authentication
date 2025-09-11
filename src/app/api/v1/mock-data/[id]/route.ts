import { FormData } from "@/app/[locale]/dashboard/data/add/components/AddForm";
import { NextRequest, NextResponse } from "next/server";
type UserData = FormData & { id: string };
const userData: UserData[] = [
  {
    id: "0",
    fName: "John",
    lName: "Doe",
    age: "30",
    email: "john@example.com",
    status: "Active",
  },
  {
    id: "1",
    fName: "Jane",
    lName: "Smith",
    age: "25",
    email: "jane@example.com",
    status: "Active",
  },
  {
    id: "2",
    fName: "Bob",
    lName: "Johnson",
    age: "35",
    email: "bob@example.com",
    status: "Inactive",
  },
  {
    id: "3",
    fName: "Alice",
    lName: "Williams",
    age: "28",
    email: "alice@example.com",
    status: "Active",
  },
  {
    id: "4",
    fName: "Charlie",
    lName: "Brown",
    age: "32",
    email: "charlie@example.com",
    status: "Pending",
  },
  {
    id: "5",
    fName: "Diana",
    lName: "Davis",
    age: "27",
    email: "diana@example.com",
    status: "Active",
  },
];
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const body: FormData = await req.json();
  const { id } = await params;
  const { age, fName, status, email, lName } = body;
  console.log(id, age, fName, status, email, lName);

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

export async function GET(req: NextRequest,{ params }: { params: Promise<{ id: string }>}) {
  console.log("he;ll");
  
  //  params;
  const {id} = await params;

   
  const data = userData.find((user) => user.id === id);
  return NextResponse.json({data });
}
