// File: app/payment/success/page.tsx

import { createClient } from "@/lib/supabase/server";

export default async function PaymentSuccess() {

  const supabase = await createClient();


  // Get latest paid order of logged-in user
  const {
    data: { user },
  } = await supabase.auth.getUser();


  let order = null;


  if (user) {

    const { data } = await supabase
      .from("orders")
      .select(`
        id,
        total,
        payment_status,
        status,
        created_at,
        order_items (
          quantity,
          price,
          products (
            title,
            image
          )
        )
      `)
      .eq("user_id", user.id)
      .eq("payment_status", "paid")
      .order("created_at", {
        ascending: false,
      })
      .limit(1)
      .single();


    order = data;

  }



  return (

    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">

      <div className="w-full max-w-2xl rounded-xl border bg-white p-8 shadow">


        <h1 className="text-center text-3xl font-bold text-green-600">
          Payment Successful
        </h1>


        <p className="mt-3 text-center text-gray-600">
          Thank you. Your order has been confirmed.
        </p>



        {order && (

          <div className="mt-8">

            <h2 className="mb-4 text-xl font-bold">
              Order Summary
            </h2>


            <div className="space-y-4">

              {order.order_items?.map(
                (item:any, index:number)=> (

                <div
                  key={index}
                  className="flex items-center gap-4 border-b pb-4"
                >

                  <img
                    src={item.products.image}
                    alt={item.products.title}
                    className="h-16 w-16 rounded object-cover"
                  />


                  <div className="flex-1">

                    <h3 className="font-semibold">
                      {item.products.title}
                    </h3>


                    <p className="text-sm text-gray-500">
                      Quantity: {item.quantity}
                    </p>

                  </div>


                  <p className="font-semibold">
                    ৳
                    {(item.price * item.quantity).toFixed(2)}
                  </p>


                </div>

              ))}

            </div>



            <div className="mt-6 border-t pt-4 space-y-2">


              <div className="flex justify-between">
                <span>
                  Order ID
                </span>

                <span className="font-semibold">
                  #{order.id}
                </span>
              </div>



              <div className="flex justify-between">
                <span>
                  Payment Status
                </span>

                <span className="font-semibold text-green-600">
                  {order.payment_status}
                </span>
              </div>



              <div className="flex justify-between text-xl font-bold">

                <span>
                  Total
                </span>

                <span>
                  ৳{Number(order.total).toFixed(2)}
                </span>

              </div>


            </div>


          </div>

        )}



        {!order && (

          <p className="mt-6 text-center text-gray-500">
            Order information is not available.
          </p>

        )}


      </div>

    </main>

  );

}