// File: app/cart/page.tsx

import Link from "next/link";
import CartItem from "@/app/components/CartItem";
import { getCart } from "@/lib/cart";

export default async function CartPage() {
  const {
    cartItems,
    totalItems,
    subtotal,
    shipping,
    total,
  } = await getCart();

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">

      <h1 className="text-3xl font-bold mb-8">
        Shopping Cart
      </h1>

      {cartItems.length === 0 ? (

        <div className="border rounded-xl p-12 text-center bg-white">

          <h2 className="text-2xl font-semibold">
            Your cart is empty
          </h2>

          <p className="text-gray-500 mt-3">
            Add some products to your cart.
          </p>

          <Link
            href="/products"
            className="inline-block mt-6 rounded-lg bg-black px-6 py-3 text-white hover:bg-gray-800 transition"
          >
            Continue Shopping
          </Link>

        </div>

      ) : (

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ===========================
              Cart Items
          =========================== */}

          <div className="lg:col-span-2 space-y-6">

            {cartItems.map((item) => {

              const product = Array.isArray(item.products)
                ? item.products[0]
                : item.products;

              if (!product) return null;

              return (
                <CartItem
                  key={item.id}
                  id={item.id}
                  quantity={item.quantity}
                  product={product}
                />
              );
            })}

          </div>

          {/* ===========================
              Order Summary
          =========================== */}

          <div className="h-fit rounded-xl border bg-white p-6 shadow-sm sticky top-6">

            <h2 className="text-2xl font-bold mb-6">
              Order Summary
            </h2>

            <div className="space-y-4">

              <div className="flex justify-between">
                <span>Total Items</span>
                <span className="font-medium">
                  {totalItems}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium">
                  ${subtotal.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-medium">
                  ${shipping.toFixed(2)}
                </span>
              </div>

              <hr />

              <div className="flex justify-between text-xl font-bold">

                <span>Total</span>

                <span>
                  ${total.toFixed(2)}
                </span>

              </div>

            </div>

            <Link
              href="/checkout"
              className="mt-8 block w-full rounded-lg bg-black py-4 text-center text-lg font-semibold text-white transition hover:bg-gray-800"
            >
              Proceed to Checkout
            </Link>

            <Link
              href="/products"
              className="mt-3 block w-full rounded-lg border py-4 text-center font-medium hover:bg-gray-100 transition"
            >
              Continue Shopping
            </Link>

          </div>

        </div>

      )}

    </main>
  );
}