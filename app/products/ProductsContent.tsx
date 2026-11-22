import { connection } from "next/server";

import { createClient } from "@/lib/supabase/server";
import ProductCards from "@/app/components/ProductCards";


export default async function ProductsContent() {

  await connection();


  const supabase = await createClient();


  const { data: products, error } = await supabase
    .from("products")
    .select("*");


  if (error) {
    return <p>Error loading products.</p>;
  }


  return (
    <main className="max-w-7xl mx-auto p-8">

      <h1 className="text-3xl font-bold mb-6">
        Products
      </h1>


      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

        {products?.map((product) => (
          <ProductCards
            key={product.id}
            product={product}
          />
        ))}

      </div>

    </main>
  );
}