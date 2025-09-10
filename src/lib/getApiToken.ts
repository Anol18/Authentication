import "server-only";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

export const getApiToken = async ({ req }: { req: NextRequest }) => {
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
    secureCookie: process.env.NODE_ENV === "production",
    cookieName: process.env.COOKIE_NAME,
    salt: process.env.COOKIE_NAME,
  });

  return token?.apiToken;
};
