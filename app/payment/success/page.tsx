import { connection } from "next/server";
import SuccessContent from "./SuccessContent";


export default async function PaymentSuccessPage(){

  await connection();


  return (
    <SuccessContent />
  );

}