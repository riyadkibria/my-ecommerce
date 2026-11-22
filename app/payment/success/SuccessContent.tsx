import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";


export default async function SuccessContent(){

  await connection();


  const supabase = await createClient();


  const {
    data:{
      user
    }
  } = await supabase.auth.getUser();



  if(!user){

    return (
      <p>
        Please login to view order.
      </p>
    );

  }



  const {
    data:order
  } = await supabase
    .from("orders")
    .select(`
      id,
      total,
      payment_status,
      status,
      created_at
    `)
    .eq(
      "user_id",
      user.id
    )
    .eq(
      "payment_status",
      "paid"
    )
    .order(
      "created_at",
      {
        ascending:false
      }
    )
    .limit(1)
    .single();



  return (

    <main className="flex min-h-screen items-center justify-center">

      <div className="rounded-xl border p-8 text-center">

        <h1 className="text-3xl font-bold text-green-600">
          Payment Successful
        </h1>


        <p className="mt-3">
          Thank you. Your order has been confirmed.
        </p>



        {order && (

          <div className="mt-6 text-left">

            <p>
              Order ID:
              <b> #{order.id}</b>
            </p>


            <p>
              Status:
              <b> {order.status}</b>
            </p>


            <p>
              Payment:
              <b> {order.payment_status}</b>
            </p>


            <p>
              Total:
              <b>
                ৳{order.total}
              </b>
            </p>


          </div>

        )}

      </div>

    </main>

  );

}