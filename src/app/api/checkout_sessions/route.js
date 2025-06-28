import { stripe } from "@/lib/stripe/stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const headersList = await headers();
    const origin = headersList.get("origin");

    // try to create a checkout session
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: "price_1ReeMvCQA5eViqsXn647UX2i",
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/wallets?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/wallets/?canceled=true`,
    });

    // redirect to the checkout page.
    return NextResponse.redirect(session.url, 303);
  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: err.statusCode || 500 }
    );
  }
}
