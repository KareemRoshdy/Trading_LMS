import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/db";
import { isTeacher } from "@/lib/teacher";

interface Props {
  params: {
    courseId: string;
    attachmentId: string;
  };
}

export async function DELETE(request: NextRequest, { params }: Props) {
  try {
    const { userId } = auth();

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

    await prisma.attachment.delete({
      where: {
        id: params.attachmentId,
        courseId: params.courseId,
      },
    });

    return NextResponse.json(
      { message: "Attachment deleted" },
      { status: 200 }
    );
  } catch (error) {
    console.log("ATTACHMENT_ID", error);
    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }
}
