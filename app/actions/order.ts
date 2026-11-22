"use server";

import { createClient } from "@/lib/supabase/server";
import { getCart } from "@/lib/cart";
import { revalidatePath } from "next/cache";

export type CreateOrderInput = {
  fullName: string;
  phone: string;
  alternativePhone?: string;
  divisionId: string;
  districtId: string;
  deliveryAreaId: string;
  address: string;
  landmark?: string;
};

export async function createOrder(
  input: CreateOrderInput
) {
  const supabase = await createClient();

  // ======================================
  // Logged-in user
  // ======================================

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ======================================
  // Read Cart
  // ======================================

  const {
    cartItems,
    subtotal,
    shipping,
    total,
  } = await getCart();

  // ======================================
  // Cart Validation
  // ======================================

  if (cartItems.length === 0) {
    throw new Error(
      "Your cart is empty."
    );
  }

  // ======================================
  // Get Division
  // ======================================

  const {
    data: division,
    error: divisionError,
  } = await supabase
    .from("divisions")
    .select("id,name")
    .eq("id", Number(input.divisionId))
    .single();

  if (divisionError || !division) {
    throw new Error(
      "Invalid division."
    );
  }

  // ======================================
  // Get District
  // ======================================

  const {
    data: district,
    error: districtError,
  } = await supabase
    .from("districts")
    .select("id,name")
    .eq("id", Number(input.districtId))
    .single();

  if (districtError || !district) {
    throw new Error(
      "Invalid district."
    );
  }

  // ======================================
  // Get Delivery Area
  // ======================================

  const {
    data: area,
    error: areaError,
  } = await supabase
    .from("delivery_areas")
    .select(`
      id,
      name,
      redx_area_id
    `)
    .eq(
      "id",
      Number(input.deliveryAreaId)
    )
    .single();

  if (areaError || !area) {
    throw new Error(
      "Invalid delivery area."
    );
  }

  // ======================================
  // Ready to Create Order
  // ======================================

  // Next part:
  // Insert into orders table
   // ======================================
  // Create Order
  // ======================================

  const { data: order, error: orderError } =
    await supabase
      .from("orders")
      .insert({
        user_id: user?.id ?? null,

        full_name: input.fullName,

        phone: input.phone,

        city: district.name,

        address_line: input.address,

        courier_slug: "redx",

        redx_area_id: area.redx_area_id,

        subtotal,

        shipping_cost: shipping,

        tax: 0,

        total,

        payment_method: "sslcommerz",

        payment_status: "pending",

        status: "pending",
      })
      .select()
      .single();

  if (orderError) {
    throw orderError;
  }

  // ======================================
  // Create Order Items
  // ======================================

  const orderItems = cartItems.map((item) => {

    const product = Array.isArray(item.products)
      ? item.products[0]
      : item.products;

    if (!product) {
      throw new Error(
        "Product not found."
      );
    }

    return {

      order_id: order.id,

      product_id: product.id,

      product_title: product.title,

      quantity: item.quantity,

      price: product.price,

    };

  });

  const { error: itemError } =
    await supabase
      .from("order_items")
      .insert(orderItems);

  if (itemError) {
    throw itemError;
  }

  // ======================================
  // Refresh Pages
  // ======================================

  revalidatePath("/cart");
  revalidatePath("/checkout");

  // ======================================
  // Return Order
  // ======================================

  return {

    orderId: order.id,

    amount: total,

  };
}