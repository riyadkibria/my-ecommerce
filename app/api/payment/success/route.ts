import { NextResponse } from "next/server";


export async function POST(
  request: Request
) {

  return NextResponse.redirect(
    new URL(
      "/payment/success",
      request.url
    )
  );

}


export async function GET(
  request: Request
) {

  return NextResponse.redirect(
    new URL(
      "/payment/success",
      request.url
    )
  );

}