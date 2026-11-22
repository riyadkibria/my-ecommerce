import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { validatePayment } from "@/lib/sslcommerz";

export async function POST(
  request: NextRequest
) {
  console.log(
    "=============================="
  );
  console.log(
    "SSLCommerz Callback Started"
  );
  console.log(
    "=============================="
  );

  try {
    const formData =
      await request.formData();

    const orderId =
      formData.get("tran_id") as string;

    const validationId =
      formData.get("val_id") as string;

    const status =
      formData.get("status") as string;

    console.log("Order ID:", orderId);
    console.log("Validation ID:", validationId);
    console.log("Status:", status);

    if (!orderId || !validationId) {
      console.log(
        "Missing payment information."
      );

      return NextResponse.json(
        {
          success: false,
          message: "Missing payment data.",
        },
        { status: 400 }
      );
    }

    // =====================================
    // Validate Payment
    // =====================================

    console.log(
      "Validating payment..."
    );

    const validation =
      await validatePayment(
        validationId
      );

    console.log(
      "Validation Response:",
      validation
    );

    if (
      validation.status !== "VALID"
    ) {
      console.log(
        "Payment validation failed."
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "Payment validation failed.",
        },
        { status: 400 }
      );
    }

    // =====================================
    // Supabase
    // =====================================

    const supabase =
      await createClient();

    console.log(
      "Fetching order..."
    );

    const {
      data: order,
      error: orderError,
    } = await supabase
      .from("orders")
      .select("*")
      .eq(
        "id",
        Number(orderId)
      )
      .single();

    console.log(
      "Order:",
      order
    );

    console.log(
      "Order Error:",
      orderError
    );

    if (
      orderError ||
      !order
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Order not found.",
        },
        { status: 404 }
      );
    }

    // =====================================
    // Already Paid?
    // =====================================

    if (
      order.payment_status ===
      "paid"
    ) {
      console.log(
        "Order already paid."
      );

      return NextResponse.redirect(
        new URL(
          "/payment/success",
          request.url
        )
      );
    }

    // =====================================
    // Amount Check
    // =====================================

    console.log(
      "Order Total:",
      order.total
    );

    console.log(
      "SSL Amount:",
      validation.amount
    );

    if (
      Number(validation.amount) !==
      Number(order.total)
    ) {
      console.log(
        "Amount mismatch!"
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "Amount mismatch.",
        },
        { status: 400 }
      );
    }

    // =====================================
    // Update Order
    // =====================================

    console.log(
      "Updating order..."
    );

    const {
      error: updateError,
    } = await supabase
      .from("orders")
      .update({

        payment_status:
          "paid",

        status:
          "confirmed",

        transaction_id:
          validationId,

        sslcommerz_tran_id:
          validationId,

        payment_gateway:
          "sslcommerz",

        paid_at:
          new Date(),

      })
      .eq(
        "id",
        order.id
      );

    console.log(
      "Update Error:",
      updateError
    );

    if (updateError) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Failed to update order.",
        },
        { status: 500 }
      );
    }

    // =====================================
    // Delete Cart
    // =====================================

    console.log(
      "Deleting cart..."
    );

    console.log(
      "User ID:",
      order.user_id
    );

    const {
      error: cartError,
    } = await supabase
      .from("cart_items")
      .delete()
      .eq(
        "user_id",
        order.user_id
      );

    console.log(
      "Cart Delete Error:",
      cartError
    );

    if (cartError) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Failed to clear cart.",
        },
        { status: 500 }
      );
    }

    console.log(
      "Cart deleted successfully."
    );

    console.log(
      "Redirecting..."
    );

    return NextResponse.redirect(
      new URL(
        "/payment/success",
        request.url
      )
    );

  } catch (error) {

    console.error(
      "Callback Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Internal server error.",
      },
      { status: 500 }
    );

  }
}