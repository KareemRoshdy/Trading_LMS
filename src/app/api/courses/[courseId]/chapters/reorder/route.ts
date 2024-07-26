import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

interface Props {
  params: {
    courseId: string;
  };
}

export async function PUT(request: NextRequest, { params }: Props) {
  try {
    const { userId } = auth();
    const { list } = await request.json();

    if (userId !== process.env.NEXT_PUBLIC_ADMIN_ID) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const admin = await prisma.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      },
    });

    if (!admin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    for (let item of list) {
      await prisma.chapter.update({
        where: { id: item.id },
        data: { position: item.position },
      });
    }

    return NextResponse.json({ message: "Success" }, { status: 200 });
  } catch (error) {
    console.log("CHAPTERS", error);

    return NextResponse.json({ message: "internal error" }, { status: 500 });
  }
}
