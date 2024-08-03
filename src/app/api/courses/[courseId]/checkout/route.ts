import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/db";

interface Props {
  params: { courseId: string };
}

export async function POST(req: NextRequest, { params }: Props) {
  try {
    const user = await currentUser();
    const { transaction_id } = await req.json();

    if (
      !user ||
      !user.id ||
      !user.emailAddresses?.[0]?.emailAddress ||
      !transaction_id
    ) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const course = await prisma.course.findUnique({
      where: {
        id: params.courseId,
        isPublished: true,
      },
    });

    const purchase = await prisma.purchase.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: params.courseId,
        },
      },
    });

    if (purchase) {
      return NextResponse.json(
        { message: "Already purchased" },
        { status: 400 }
      );
    }

    if (!course) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    let stripeCustomer = await prisma.stripeCustomer.findUnique({
      where: {
        userId: user.id,
      },
      select: {
        stripeCustomerId: true,
      },
    });

    if (!stripeCustomer) {
      stripeCustomer = await prisma.stripeCustomer.create({
        data: {
          userId: user.id,
          stripeCustomerId: transaction_id,
        },
      });
    }

    await prisma.purchase.create({
      data: {
        userId: user.id,
        courseId: params.courseId,
      },
    });

    return NextResponse.json({ message: "course opened" }, { status: 201 });
  } catch (error) {
    console.log("[COURSE_ID_CHECKOUT]", error);

    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }
}
