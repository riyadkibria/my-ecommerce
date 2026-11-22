// File: app/actions/cart.ts

"use server";

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function addToCart(productId: number) {
  const supabase = await createClient();
  const cookieStore = await cookies();

  // Check logged-in user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let cartSessionId: number;

  // ====================================================
  // LOGGED-IN USER
  // ====================================================

  if (user) {
    const { data: userCart } = await supabase
      .from("cart_sessions")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (userCart) {
      cartSessionId = userCart.id;
    } else {
      const { data: newCart, error } = await supabase
        .from("cart_sessions")
        .insert({
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      cartSessionId = newCart.id;
    }

    cookieStore.set("cart_session_id", String(cartSessionId), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
    });
  }

  // ====================================================
  // GUEST USER
  // ====================================================

  else {
    const existingCookie = cookieStore.get("cart_session_id");

    if (existingCookie) {
      const cookieSessionId = Number(existingCookie.value);

      const { data: existingSession } = await supabase
        .from("cart_sessions")
        .select("id")
        .eq("id", cookieSessionId)
        .maybeSingle();

      if (existingSession) {
        cartSessionId = existingSession.id;
      } else {
        const { data: newSession, error } = await supabase
          .from("cart_sessions")
          .insert({
            user_id: null,
          })
          .select()
          .single();

        if (error) throw error;

        cartSessionId = newSession.id;

        cookieStore.set("cart_session_id", String(cartSessionId), {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 30,
        });
      }
    } else {
      const { data: newSession, error } = await supabase
        .from("cart_sessions")
        .insert({
          user_id: null,
        })
        .select()
        .single();

      if (error) throw error;

      cartSessionId = newSession.id;

      cookieStore.set("cart_session_id", String(cartSessionId), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30,
      });
    }
  }

  // ====================================================
  // CHECK IF PRODUCT EXISTS
  // ====================================================

  const { data: existingItem } = await supabase
    .from("cart_items")
    .select("*")
    .eq("cart_session_id", cartSessionId)
    .eq("product_id", productId)
    .maybeSingle();

  if (existingItem) {
    const { error } = await supabase
      .from("cart_items")
      .update({
        quantity: existingItem.quantity + 1,
      })
      .eq("id", existingItem.id);

    if (error) throw error;
  } else {
    const { error } = await supabase
      .from("cart_items")
      .insert({
        user_id: user?.id ?? null,
        cart_session_id: cartSessionId,
        product_id: productId,
        quantity: 1,
      });

    if (error) throw error;
  }

  revalidatePath("/products");
  revalidatePath("/cart");

  return {
    success: true,
  };
}

// ====================================================
// INCREASE QUANTITY
// ====================================================

export async function increaseQuantity(cartItemId: number) {
  const supabase = await createClient();

  const { data: item, error } = await supabase
    .from("cart_items")
    .select("quantity")
    .eq("id", cartItemId)
    .single();

  if (error) throw error;

  const { error: updateError } = await supabase
    .from("cart_items")
    .update({
      quantity: item.quantity + 1,
    })
    .eq("id", cartItemId);

  if (updateError) throw updateError;

  revalidatePath("/cart");
}

// ====================================================
// DECREASE QUANTITY
// ====================================================

export async function decreaseQuantity(cartItemId: number) {
  const supabase = await createClient();

  const { data: item, error } = await supabase
    .from("cart_items")
    .select("quantity")
    .eq("id", cartItemId)
    .single();

  if (error) throw error;

  if (item.quantity <= 1) {
    await removeCartItem(cartItemId);
    return;
  }

  const { error: updateError } = await supabase
    .from("cart_items")
    .update({
      quantity: item.quantity - 1,
    })
    .eq("id", cartItemId);

  if (updateError) throw updateError;

  revalidatePath("/cart");
}

// ====================================================
// REMOVE ITEM
// ====================================================

export async function removeCartItem(cartItemId: number) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("cart_items")
    .delete()
    .eq("id", cartItemId);

  if (error) throw error;

  revalidatePath("/cart");
}