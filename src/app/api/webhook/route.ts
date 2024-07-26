import { stripe } from "@/lib/stripe";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

import { headers } from "next/headers";
import prisma from "@/lib/db";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: `Webhook Error: ${error.message}` },
      { status: 400 }
    );
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const userId = session?.metadata?.userId;
  const courseId = session?.metadata?.courseId;

  if (event.type === "checkout.session.completed") {
    if (!userId || !courseId) {
      return NextResponse.json(
        { message: `Webhook Error: Missing metadata` },
        { status: 400 }
      );
    }

    await prisma.purchase.create({
      data: {
        userId,
        courseId,
      },
    });
  } else {
    return NextResponse.json(
      { message: `Webhook Error: Unhandled event type ${event.type}` },
      { status: 200 }
    );
  }


  return NextResponse.json(
    null,
    { status: 200 }
  );
}
