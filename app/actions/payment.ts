// File: app/actions/payment.ts

"use server";

type PaymentData = {
  orderId: string;
  amount: number;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
};

export async function startPayment(
  paymentData: PaymentData
) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (!baseUrl) {
    throw new Error(
      "NEXT_PUBLIC_APP_URL is missing"
    );
  }

  const storeId =
    process.env.SSLCOMMERZ_STORE_ID;

  const storePassword =
    process.env.SSLCOMMERZ_STORE_PASSWORD;

  if (
    !storeId ||
    !storePassword
  ) {
    throw new Error(
      "SSLCommerz credentials missing"
    );
  }

  // ============================
  // DEBUG
  // ============================

  console.log("========== SSL URLS ==========");

  console.log({
    success_url:
      `${baseUrl}/api/payment/callback`,

    fail_url:
      `${baseUrl}/payment/fail`,

    cancel_url:
      `${baseUrl}/payment/cancel`,

    ipn_url:
      `${baseUrl}/api/payment/callback`,
  });

  console.log("==============================");

  const response = await fetch(
    "https://sandbox.sslcommerz.com/gwprocess/v4/api.php",
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/x-www-form-urlencoded",
      },

      body: new URLSearchParams({
        // Store

        store_id: storeId,

        store_passwd: storePassword,

        // Transaction

        total_amount:
          paymentData.amount.toString(),

        currency: "BDT",

        tran_id:
          paymentData.orderId,

        // IMPORTANT
        // Send BOTH success and IPN
        // to callback route.

        success_url:
          `${baseUrl}/api/payment/callback`,

        fail_url:
          `${baseUrl}/payment/fail`,

        cancel_url:
          `${baseUrl}/payment/cancel`,

        ipn_url:
          `${baseUrl}/api/payment/callback`,

        // Customer

        cus_name:
          paymentData.customer.name,

        cus_email:
          paymentData.customer.email,

        cus_phone:
          paymentData.customer.phone,

        cus_add1:
          paymentData.customer.address,

        cus_city:
          "Dhaka",

        cus_country:
          "Bangladesh",

        // Product

        shipping_method:
          "NO",

        product_name:
          "Ecommerce Product",

        product_category:
          "General",

        product_profile:
          "general",
      }),
    }
  );

  const data =
    await response.json();

  console.log(
    "SSLCommerz Response:",
    data
  );

  if (
    data.status !== "SUCCESS"
  ) {
    throw new Error(
      JSON.stringify(data)
    );
  }

  return data.GatewayPageURL;
}