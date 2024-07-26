import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

interface Props {
  params: {
    courseId: string;
    chapterId: string;
  };
}

export async function PUT(request: NextRequest, { params }: Props) {
  try {
    const { userId } = auth();
    const { courseId, chapterId } = params;
    const { isCompleted } = await request.json();

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userProgress = await prisma.userProgress.upsert({
      where: {
        userId_chapterId: {
          userId,
          chapterId,
        },
      },
      update: {
        isCompleted,
      },
      create: {
        userId,
        chapterId,
        isCompleted,
      },
    });

    return NextResponse.json(userProgress, { status: 200 });
  } catch (error) {
    console.log("[CHAPTER_ID_PROGRESS]", error);

    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }
}
