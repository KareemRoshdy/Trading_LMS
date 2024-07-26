export const isTeacher = (userId?: string | null) => {
  return userId === process.env.NEXT_PUBLIC_ADMIN_ID;
};
