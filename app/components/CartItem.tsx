"use client";

import {
  increaseQuantity,
  decreaseQuantity,
  removeCartItem,
} from "@/app/actions/cart";

type Product = {
  id: number;
  title: string;
  image: string;
  price: number;
};

type CartItemProps = {
  id: number;
  quantity: number;
  product: Product;
};

export default function CartItem({
  id,
  quantity,
  product,
}: CartItemProps) {
  return (
    <div className="border rounded-lg p-4 flex gap-6 items-center">

      {/* Product Image */}
      <img
        src={product.image}
        alt={product.title}
        width={120}
        className="rounded"
      />

      {/* Product Details */}
      <div className="flex-1">

        <h2 className="text-xl font-semibold">
          {product.title}
        </h2>

        <p className="mt-2">
          Price: ${product.price}
        </p>

        <p className="font-bold mt-2">
          Subtotal: $
          {product.price * quantity}
        </p>

      </div>

      {/* Quantity Controls */}
      <div className="flex flex-col items-center gap-3">

        <div className="flex items-center gap-2">

          <button
            onClick={async () => {
              await decreaseQuantity(id);
            }}
            className="w-10 h-10 rounded bg-gray-200 text-xl"
          >
            -
          </button>

          <span className="w-8 text-center font-bold">
            {quantity}
          </span>

          <button
            onClick={async () => {
              await increaseQuantity(id);
            }}
            className="w-10 h-10 rounded bg-gray-200 text-xl"
          >
            +
          </button>

        </div>

        <button
          onClick={async () => {
            await removeCartItem(id);
          }}
          className="text-red-600 hover:underline"
        >
          Remove
        </button>

      </div>

    </div>
  );
}