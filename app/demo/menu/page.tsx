import { supabase } from "@/lib/supabase/client";

export default async function MenuPage() {
  const { data: categories } = await supabase
    .from("categories")
    .select("*");

  const { data: products } = await supabase
    .from("products")
    .select("*");

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-[#111827] text-white">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <h1 className="text-5xl font-bold">
            Wolf Ordering
          </h1>

          <p className="text-slate-300 mt-2">
            Menú digital inteligente
          </p>
        </div>
      </div>

      {/* Menu */}
      <div className="max-w-6xl mx-auto px-6 py-10">

        {categories?.map((category) => (
          <section
            key={category.id}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold text-slate-800 mb-6">
              {category.name}
            </h2>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {products
                ?.filter(
                  (p) =>
                    p.category_id === category.id
                )
                .map((product) => (
                  <div
                    key={product.id}
                    className="
                      bg-white
                      rounded-3xl
                      overflow-hidden
                      shadow-lg
                      hover:shadow-xl
                      transition
                    "
                  >
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="
                        w-full
                        h-56
                        object-cover
                      "
                    />

                    <div className="p-5">
                      <h3 className="text-xl font-bold text-slate-900">
                        {product.name}
                      </h3>

                      <p className="text-slate-600 mt-2">
                        {product.description}
                      </p>

                      <div className="mt-5 flex items-center justify-between">
                        <span className="text-2xl font-bold text-[#f97316]">
                          ${Number(product.price).toFixed(2)}
                        </span>

                        <button
                          className="
                            bg-[#f97316]
                            hover:bg-[#ea580c]
                            text-white
                            px-5
                            py-2
                            rounded-xl
                            font-medium
                          "
                        >
                          Agregar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}