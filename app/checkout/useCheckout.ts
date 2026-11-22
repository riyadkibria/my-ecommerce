// app/checkout/useCheckout.ts

"use client";

import { useState } from "react";
import { createOrder } from "@/app/actions/order";
import { startPayment } from "@/app/actions/payment";

import type {
  District,
  DeliveryArea
} from "./types";


export function useCheckout(){


  const [selectedDivision,setSelectedDivision]
  = useState("");

  const [selectedDistrict,setSelectedDistrict]
  = useState("");

  const [selectedArea,setSelectedArea]
  = useState("");


  const [districts,setDistricts]
  = useState<District[]>([]);


  const [areas,setAreas]
  = useState<DeliveryArea[]>([]);


  const [loadingDistricts,setLoadingDistricts]
  = useState(false);


  const [loadingAreas,setLoadingAreas]
  = useState(false);


  const [submitting,setSubmitting]
  = useState(false);


  const [districtError,setDistrictError]
  = useState("");


  const [areaError,setAreaError]
  = useState("");



  async function handleDivisionChange(
    divisionId:string
  ){

    setSelectedDivision(divisionId);

    setSelectedDistrict("");

    setSelectedArea("");

    setDistricts([]);

    setAreas([]);

    setDistrictError("");

    setAreaError("");


    if(!divisionId) return;


    try{

      setLoadingDistricts(true);


      const response =
      await fetch(
        `/api/locations/districts?divisionId=${divisionId}`
      );


      const data =
      await response.json();


      if(!response.ok){

        throw new Error(
          data.error ||
          "Failed loading districts"
        );

      }


      setDistricts(data);


    }
    catch(error){

      setDistrictError(
        error instanceof Error
        ? error.message
        : "Something went wrong"
      );

    }
    finally{

      setLoadingDistricts(false);

    }

  }





  async function handleDistrictChange(
    districtId:string
  ){

    setSelectedDistrict(districtId);

    setSelectedArea("");

    setAreas([]);

    setAreaError("");


    if(!districtId) return;


    try{

      setLoadingAreas(true);


      const response =
      await fetch(
        `/api/locations/areas?districtId=${districtId}`
      );


      const data =
      await response.json();


      if(!response.ok){

        throw new Error(
          data.error ||
          "Failed loading areas"
        );

      }


      setAreas(data);


    }
    catch(error){

      setAreaError(
        error instanceof Error
        ? error.message
        : "Something went wrong"
      );

    }
    finally{

      setLoadingAreas(false);

    }

  }





  async function handleSubmit(
    event:React.FormEvent<HTMLFormElement>
  ){

    event.preventDefault();


    try{


      setSubmitting(true);



      const formData =
      new FormData(
        event.currentTarget
      );



      const data =
      Object.fromEntries(
        formData.entries()
      );



      // 1. Create order in Supabase

      const order =
      await createOrder({

        fullName:
        String(data.fullName),


        phone:
        String(data.phone),


        alternativePhone:
        String(data.alternativePhone || ""),


        divisionId:
        String(data.divisionId),


        districtId:
        String(data.districtId),


        deliveryAreaId:
        String(data.deliveryAreaId),


        address:
        String(data.address),


        landmark:
        String(data.landmark || "")

      });



      console.log(
        "ORDER CREATED:",
        order
      );



      /*
        createOrder must return:

        {
          orderId: "123",
          amount: 1500
        }

      */



      if(!order.orderId){

        throw new Error(
          "Order ID missing"
        );

      }



      if(!order.amount){

        throw new Error(
          "Order amount missing from createOrder"
        );

      }




      // 2. Start SSLCommerz payment

      const gatewayUrl =
      await startPayment({

        orderId:
        String(order.orderId),


        amount:
        Number(order.amount),



        customer:{

          name:
          String(data.fullName),


          email:
          "customer@example.com",


          phone:
          String(data.phone),


          address:
          String(data.address)

        }

      });





      if(!gatewayUrl){

        throw new Error(
          "Payment gateway URL missing"
        );

      }




      // 3. Redirect to SSLCommerz

      window.location.href =
      gatewayUrl;



    }
    catch(error){


      console.error(
        "CHECKOUT ERROR:",
        error
      );


      alert(

        error instanceof Error

        ? error.message

        : "Something went wrong"

      );


    }
    finally{

      setSubmitting(false);

    }


  }





  return {


    selectedDivision,

    selectedDistrict,

    selectedArea,


    districts,

    areas,


    loadingDistricts,

    loadingAreas,


    submitting,


    districtError,

    areaError,



    setSelectedArea,


    handleDivisionChange,

    handleDistrictChange,

    handleSubmit


  };


}