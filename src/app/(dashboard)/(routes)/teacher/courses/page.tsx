import { redirect } from "next/navigation";
import prisma from "@/lib/db";

import { DataTable } from "./_components/DataTable";
import { columns } from "./_components/columns";
import { auth } from "@clerk/nextjs/server";

const CoursesPage = async () => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const courses = await prisma.course.findMany({
    where: {
      userId,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6">
      <DataTable columns={columns} data={courses} />
    </div>
  );
};

export default CoursesPage;
