// app/actions/payment.ts

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
){


  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    "https://my-ecommerce-lyart-xi.vercel.app/";



  if(
    !process.env.SSLCOMMERZ_STORE_ID ||
    !process.env.SSLCOMMERZ_STORE_PASSWORD
  ){

    throw new Error(
      "SSLCommerz credentials missing"
    );

  }



  const response = await fetch(

    "https://sandbox.sslcommerz.com/gwprocess/v4/api.php",

    {

      method:"POST",


      headers:{

        "Content-Type":
        "application/x-www-form-urlencoded"

      },


      body:new URLSearchParams({



        // SSLCommerz credentials

        store_id:
        process.env.SSLCOMMERZ_STORE_ID,


        store_passwd:
        process.env.SSLCOMMERZ_STORE_PASSWORD,




        // Order information

        total_amount:
        paymentData.amount.toString(),


        currency:
        "BDT",


        tran_id:
        paymentData.orderId,




        // SSLCommerz server callback

        ipn_url:
        `${baseUrl}/api/payment/callback`,




        // Customer redirect

        success_url:
        `${baseUrl}/payment/success`,


        fail_url:
        `${baseUrl}/payment/fail`,


        cancel_url:
        `${baseUrl}/payment/cancel`,




        // Customer information

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




        // Product information

        shipping_method:
        "NO",


        product_name:
        "Ecommerce Product",


        product_category:
        "General",


        product_profile:
        "general"


      })

    }

  );



  const data =
  await response.json();



  console.log(
    "SSLCommerz Response:",
    data
  );



  if(
    data.status !== "SUCCESS"
  ){

    throw new Error(
      JSON.stringify(data)
    );

  }



  return data.GatewayPageURL;

}