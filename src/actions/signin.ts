

import { clientFetch } from "@/lib/clientFetch";




export const signin = async ({
  username,
  password,
}: {
  username: string;
  password: string;
}) => {
  try {
    const res = await clientFetch("/auth/signin", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
    if (res.ok) {
      return res.json();
    }
  } catch (error) {
    console.log(error);
  }
};
