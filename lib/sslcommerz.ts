const STORE_ID =
  process.env.SSLCOMMERZ_STORE_ID!;

const STORE_PASSWORD =
  process.env.SSLCOMMERZ_STORE_PASSWORD!;

const IS_LIVE =
  process.env.SSLCOMMERZ_IS_LIVE === "true";

const BASE_URL = IS_LIVE
  ? "https://securepay.sslcommerz.com"
  : "https://sandbox.sslcommerz.com";

export type CreatePaymentSessionInput = {
  orderId: number;
  amount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
};

export async function createPaymentSession(
  data: CreatePaymentSessionInput
) {
  const body = {
    store_id: STORE_ID,
    store_passwd: STORE_PASSWORD,

    total_amount: String(data.amount),
    currency: "BDT",

    tran_id: String(data.orderId),

    success_url:
      "http://localhost:3000/api/sslcommerz/success",

    fail_url:
      "http://localhost:3000/api/sslcommerz/fail",

    cancel_url:
      "http://localhost:3000/api/sslcommerz/cancel",

    ipn_url:
      "http://localhost:3000/api/sslcommerz/ipn",

    shipping_method: "Courier",

    product_name: "Order Payment",

    product_category: "Ecommerce",

    product_profile: "general",

    cus_name: data.customerName,

    cus_email: data.customerEmail,

    cus_add1: "Bangladesh",

    cus_city: "Dhaka",

    cus_country: "Bangladesh",

    cus_phone: data.customerPhone,
  };

  const response = await fetch(
    `${BASE_URL}/gwprocess/v4/api.php`,
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(
        body as Record<string, string>
      ),
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to connect to SSLCommerz."
    );
  }

  return response.json();
}

// ========================================
// Validate Payment
// ========================================

export async function validatePayment(
  valId: string
) {
  const response = await fetch(
    `${BASE_URL}/validator/api/validationserverAPI.php?val_id=${valId}&store_id=${STORE_ID}&store_passwd=${STORE_PASSWORD}&format=json`
  );

  if (!response.ok) {
    throw new Error(
      "Failed to validate payment."
    );
  }

  const result = await response.json();

  return result;
}