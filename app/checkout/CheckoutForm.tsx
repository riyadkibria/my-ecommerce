"use client";


import {
  useCheckout
} from "./useCheckout";


import type {
  CheckoutProps
} from "./types";



export default function CheckoutForm({
  divisions
}:CheckoutProps){


const {

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


}=useCheckout();



const inputClass =
"w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-gray-900";


return (

<form onSubmit={handleSubmit}>


<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">


<section className="rounded-xl border p-5">


<h2 className="mb-5 text-lg font-semibold">
Contact Information
</h2>



<input
name="fullName"
placeholder="Full name"
required
className={inputClass}
/>



<input
name="phone"
placeholder="Phone"
required
className={`${inputClass} mt-4`}
/>



<input
name="alternativePhone"
placeholder="Alternative phone"
className={`${inputClass} mt-4`}
/>



</section>





<section className="rounded-xl border p-5">


<h2 className="mb-5 text-lg font-semibold">
Delivery Address
</h2>



<select

name="divisionId"

value={selectedDivision}

onChange={(e)=>
handleDivisionChange(
e.target.value
)}

className={inputClass}

>

<option value="">
Choose Division
</option>


{
divisions.map(item=>(

<option
key={item.id}
value={item.id}
>

{item.name}

</option>

))
}


</select>




<select

name="districtId"

value={selectedDistrict}

disabled={!selectedDivision}

onChange={(e)=>
handleDistrictChange(
e.target.value
)}

className={`${inputClass} mt-4`}

>


<option value="">
Choose District
</option>


{
districts.map(item=>(

<option
key={item.id}
value={item.id}
>

{item.name}

</option>

))
}


</select>




<select

name="deliveryAreaId"

value={selectedArea}

disabled={!selectedDistrict}

onChange={(e)=>
setSelectedArea(
e.target.value
)}

className={`${inputClass} mt-4`}

>


<option value="">
Choose Area
</option>


{
areas.map(item=>(

<option
key={item.id}
value={item.id}
>

{item.name}

</option>

))
}


</select>




<textarea

name="address"

required

placeholder="Full address"

className={`${inputClass} mt-4`}

/>



<input

name="landmark"

placeholder="Landmark"

className={`${inputClass} mt-4`}

/>


</section>


</div>



<button

disabled={submitting}

className="mt-6 rounded-xl bg-black px-8 py-3 text-white"

>

{
submitting
?
"Processing..."
:
"Proceed to payment"
}


</button>


</form>

);

}