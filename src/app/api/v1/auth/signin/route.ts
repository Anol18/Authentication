import { z } from "zod";
export const UserSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export type UserInput = z.infer<typeof UserSchema>;
const credentials = {
  username: "ucb",
  password: "123456",
};

import type { NextRequest } from "next/server";

import { getApiToken } from "@/lib/getApiToken";

export async function POST(req: NextRequest) {
  const body: UserInput = await req.json();

  const result = UserSchema.safeParse(body);

  if (result.success) {
    const { username, password } = body;

    if (
      credentials.password === password &&
      credentials.username === username
    ) {
      return Response.json({
        isValid: true,
        token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJOYW1lIjoiVUNCIiwiZW1haWwiOiJ1Y2JAdWNiLmNvbS5iZCIsInBlcm1pc3Npb24iOiJBbGwiLCJpYXQiOjE3NTczMTU4MjJ9.XHxm4kayVtHl6rfG43VHPgWs8LfSuObFI_7ZWmrGNMk",
        message: "Login Success",
      });
    } else {
      return Response.json({
        isValid: false,
        token: null,
        message: "Login failed",
      });
    }
  }
}

export async function GET(req: NextRequest) {
  
const token = await getApiToken({ req });
  console.log("session >>>", token);
  return Response.json({
    data: "session",
  });
}
