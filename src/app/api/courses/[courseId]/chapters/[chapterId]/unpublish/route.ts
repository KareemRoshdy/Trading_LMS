import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

interface Props {
  params: {
    courseId: string;
    chapterId: string;
  };
}

export async function PATCH(request: NextRequest, { params }: Props) {
  try {
    const { userId } = auth();
    const { courseId, chapterId } = params;

    if (userId !== process.env.NEXT_PUBLIC_ADMIN_ID) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const ownCourse = await prisma.course.findUnique({
      where: {
        id: courseId,
        userId,
      },
    });

    if (!ownCourse) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const unpublishedChapter = await prisma.chapter.update({
      where: {
        id: chapterId,
        courseId,
      },
      data: {
        isPublished: false,
      },
    });

    const publishedChaptersInCourse = await prisma.chapter.findMany({
      where: {
        courseId,
        isPublished: true,
      },
    });

    if (!publishedChaptersInCourse.length) {
      await prisma.course.update({
        where: {
          id: courseId,
        },
        data: {
          isPublished: false,
        },
      });
    }

    return NextResponse.json(unpublishedChapter, { status: 200 });
  } catch (error) {
    console.log("[CHAPTER_UNPUBLISH]", error);

    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }
}
