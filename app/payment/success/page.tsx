import { Suspense } from "react";
import SuccessContent from "./SuccessContent";


export default function PaymentSuccessPage(){

  return (

    <Suspense
      fallback={
        <p className="p-10">
          Loading...
        </p>
      }
    >

      <SuccessContent />

    </Suspense>

  );

}