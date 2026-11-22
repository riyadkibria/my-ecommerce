import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";


export async function POST(
  request: NextRequest
){

  const formData =
    await request.formData();


  const tran_id =
    formData.get("tran_id") as string;


  const val_id =
    formData.get("val_id") as string;


  const status =
    formData.get("status") as string;



  console.log(
    "Payment Callback:",
    {
      tran_id,
      val_id,
      status
    }
  );



  if(status !== "VALID"){

    return NextResponse.json({
      success:false,
      message:"Invalid payment"
    });

  }



  // Here we verify SSLCommerz transaction
  // next step will add validation API



  const supabase =
    await createClient();



  const {error}=await supabase
    .from("orders")
    .update({

      payment_status:"paid",

      transaction_id:
        val_id,

      payment_gateway:
        "sslcommerz",

      paid_at:
        new Date()

    })
    .eq(
      "id",
      tran_id
    );



  if(error){

    console.error(error);


    return NextResponse.json({
      success:false
    });

  }



  return NextResponse.json({
    success:true
  });

}