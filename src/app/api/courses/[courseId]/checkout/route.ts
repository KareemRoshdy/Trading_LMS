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

// import { currentUser } from "@clerk/nextjs/server";
// import { NextRequest, NextResponse } from "next/server";

// import prisma from "@/lib/db";
// import Stripe from "stripe";
// import { stripe } from "@/lib/stripe";

// interface Props {
//   params: { courseId: string };
// }

// export async function POST(req: NextRequest, { params }: Props) {
//   try {
//     const user = await currentUser();

//     if (!user || !user.id || !user.emailAddresses?.[0]?.emailAddress) {
//       return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//     }

//     const course = await prisma.course.findUnique({
//       where: {
//         id: params.courseId,
//         isPublished: true,
//       },
//     });

//     const purchase = await prisma.purchase.findUnique({
//       where: {
//         userId_courseId: {
//           userId: user.id,
//           courseId: params.courseId,
//         },
//       },
//     });

//     if (purchase) {
//       return NextResponse.json(
//         { message: "Already purchased" },
//         { status: 400 }
//       );
//     }

//     if (!course) {
//       return NextResponse.json({ message: "Not found" }, { status: 404 });
//     }

//     const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [
//       {
//         quantity: 1,
//         price_data: {
//           currency: "USD",
//           product_data: {
//             name: course.title,
//             description: course.description!,
//           },
//           unit_amount: Math.round(course.price! * 100),
//         },
//       },
//     ];

//     let stripeCustomer = await prisma.stripeCustomer.findUnique({
//       where: {
//         userId: user.id,
//       },
//       select: {
//         stripeCustomerId: true,
//       },
//     });

//     if (!stripeCustomer) {
//       const customer = await stripe.customers.create({
//         email: user.emailAddresses[0].emailAddress,
//       });

//       stripeCustomer = await prisma.stripeCustomer.create({
//         data: {
//           userId: user.id,
//           stripeCustomerId: customer.id,
//         },
//       });
//     }

//     const session = await stripe.checkout.sessions.create({
//       customer: stripeCustomer.stripeCustomerId,
//       line_items,
//       mode: "payment",
//       success_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.id}?success=1`,
//       cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.id}?canceled=1`,
//       metadata: {
//         courseId: course.id,
//         userId: user.id,
//       },
//     });

//     return NextResponse.json({ url: session.url }, { status: 201 });
//   } catch (error) {
//     console.log("[COURSE_ID_CHECKOUT]", error);

//     return NextResponse.json({ message: "Internal error" }, { status: 500 });
//   }
// }
