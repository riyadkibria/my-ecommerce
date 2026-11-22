"use client";

import { addToCart } from "@/app/actions/cart";
import { useState } from "react";

type Product = {
  id: number;
  title: string;
  image: string;
  price: number;
  stock: number;
};

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({
  product,
}: ProductCardProps) {

  const [loading, setLoading] = useState(false);

  async function handleAddToCart() {
    try {
      setLoading(true);

      await addToCart(product.id);

      alert("Added to cart");

    } catch (error) {
      console.error(error);
      alert("Failed to add cart");

    } finally {
      setLoading(false);
    }
  }


  return (
    <div className="border rounded-lg p-4">

      <img
        src={product.image}
        alt={product.title}
        width={200}
      />

      <h2>{product.title}</h2>

      <p>${product.price}</p>

      <p>Stock: {product.stock}</p>


      <button
        onClick={handleAddToCart}
        disabled={loading}
        className="bg-black text-white px-4 py-2 rounded"
      >
        {loading ? "Adding..." : "Add to Cart"}
      </button>

    </div>
  );
}