import { auth } from "@clerk/nextjs/server";

const isAdmin = (): Boolean => {
  const { userId } = auth();

  return userId === process.env.NEXT_PUBLIC_ADMIN_ID;
};

export default isAdmin;
