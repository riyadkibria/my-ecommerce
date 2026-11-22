import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export async function getCart() {

  const supabase = await createClient();

  const cookieStore = await cookies();

  const cartSessionId =
    cookieStore.get("cart_session_id")?.value;

  const {
    data: { user },
  } = await supabase.auth.getUser();



  let query = supabase
    .from("cart_items")
    .select(`
      id,
      quantity,
      product_id,
      products (
        id,
        title,
        image,
        price
      )
    `);



  if (user) {

    query = query.eq(
      "user_id",
      user.id
    );

  }

  else if (cartSessionId) {

    query = query.eq(
      "cart_session_id",
      Number(cartSessionId)
    );

  }



  const { data: cartItems, error } =
    await query;

  if (error) {
    throw error;
  }



  let totalItems = 0;

  let subtotal = 0;



  for (const item of cartItems ?? []) {

    const product = Array.isArray(item.products)
      ? item.products[0]
      : item.products;

    if (!product) continue;

    totalItems += item.quantity;

    subtotal +=
      Number(product.price) *
      item.quantity;

  }



  const shipping =
    subtotal > 0 ? 10 : 0;

  const total =
    subtotal + shipping;



  return {

    user,

    cartItems: cartItems ?? [],

    totalItems,

    subtotal,

    shipping,

    total,

  };

}