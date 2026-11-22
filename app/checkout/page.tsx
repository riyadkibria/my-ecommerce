// File: app/checkout/page.tsx

import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { getDivisions } from "@/lib/locations";
import CheckoutForm from "./CheckoutForm";

export async function CheckoutContent() {
  const supabase = await createClient();

  const cookieStore = await cookies();

  const cartSessionId =
    cookieStore.get("cart_session_id")?.value;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const divisions = await getDivisions();

  // -------------------------
  // Load Cart
  // -------------------------

  let query = supabase
    .from("cart_items")
    .select(`
      id,
      quantity,
      products (
        id,
        title,
        image,
        price
      )
    `);

  if (user) {
    query = query.eq("user_id", user.id);
  } else if (cartSessionId) {
    query = query.eq(
      "cart_session_id",
      Number(cartSessionId)
    );
  }

  const { data: cartItems } = await query;

  // -------------------------
  // Calculate Total
  // -------------------------

  let subtotal = 0;

  if (cartItems) {
    for (const item of cartItems) {
      const product = Array.isArray(item.products)
        ? item.products[0]
        : item.products;

      if (!product) continue;

      subtotal +=
        Number(product.price) *
        item.quantity;
    }
  }

  const shipping = 10;
  const total = subtotal + shipping;

  return (
    <main className="w-full min-h-screen px-4 py-8 sm:px-6 lg:px-10">

      <div className="grid lg:grid-cols-3 gap-10">

        {/* LEFT SIDE */}

        <div className="lg:col-span-2">

          <h1 className="text-2xl font-bold mb-6">
            Checkout
          </h1>

          <CheckoutForm divisions={divisions} />

        </div>

        {/* RIGHT SIDE */}

        <div className="border rounded-lg p-6 h-fit">

          <h2 className="text-xl font-bold mb-6">
            Order Summary
          </h2>

          <div className="space-y-4">

            {cartItems?.map((item) => {

              const product = Array.isArray(item.products)
                ? item.products[0]
                : item.products;

              if (!product) return null;

              return (

                <div
                  key={item.id}
                  className="flex gap-4 items-center"
                >

                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-16 h-16 object-cover rounded"
                  />

                  <div className="flex-1">

                    <h3 className="font-semibold">
                      {product.title}
                    </h3>

                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity}
                    </p>

                  </div>

                  <p className="font-semibold">
                    $
                    {(
                      Number(product.price) *
                      item.quantity
                    ).toFixed(2)}
                  </p>

                </div>

              );

            })}

          </div>

          <hr className="my-6" />

          <div className="space-y-3">

            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>
                ${subtotal.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Shipping</span>
              <span>
                ${shipping.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between text-xl font-bold border-t pt-4">
              <span>Total</span>
              <span>
                ${total.toFixed(2)}
              </span>
            </div>

          </div>

        </div>

      </div>

    </main>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <p className="p-6">
          Loading checkout...
        </p>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}