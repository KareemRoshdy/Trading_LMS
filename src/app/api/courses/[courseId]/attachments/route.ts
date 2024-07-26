import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/db";
import { isTeacher } from "@/lib/teacher";

interface Props {
  params: {
    courseId: string;
  };
}

export async function POST(request: NextRequest, { params }: Props) {
  try {
    const { userId } = auth();
    const { url } = await request.json();

    if (!userId || !isTeacher(userId)) {
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

    const attachment = await prisma.attachment.create({
      data: {
        url,
        name: url.split("/").pop(),
        courseId: params.courseId,
      },
    });

    return NextResponse.json(attachment, { status: 201 });
  } catch (error) {
    console.log("COURSE_ID_ATTACHMENTS", error);
    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }
}
