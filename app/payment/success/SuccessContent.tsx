import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";


export default async function SuccessContent(){

  await connection();


  const supabase =
    await createClient();


  const {
    data:{
      user
    }
  } =
    await supabase.auth.getUser();



  return (

    <div className="flex min-h-screen items-center justify-center">

      <div className="rounded-xl border p-8 text-center">

        <h1 className="text-3xl font-bold text-green-600">
          Payment Successful
        </h1>


        <p className="mt-3">
          Thank you. Your order has been confirmed.
        </p>


        <p className="mt-4">
          User:
          {user?.email}
        </p>


      </div>

    </div>

  );

}