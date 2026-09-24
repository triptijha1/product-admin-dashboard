"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import ProductForm from "@/components/ProductForm";
import { getProductById } from "@/services/productApi";

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getProductById(
          String(params.id)
        );

        setProduct(data);
      } catch (error) {
        console.error(
          "FETCH PRODUCT ERROR:",
          error
        );

        setError("Product not found");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.id]);

  // Loading
  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-3xl rounded-2xl bg-white p-10 text-center shadow-sm">
          <p className="text-gray-500">
            Loading product...
          </p>
        </div>
      </main>
    );
  }

  // Error
  if (error || !product) {
    return (
      <main className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-3xl rounded-2xl bg-white p-10 text-center shadow-sm">
          <h1 className="mb-3 text-2xl font-bold text-gray-900">
            Product Not Found
          </h1>

          <p className="mb-6 text-gray-500">
            The requested product could not be found.
          </p>

          <button
            onClick={() => router.push("/")}
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-white transition hover:bg-blue-700"
          >
            Back to Products
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-3xl">

        {/* Header */}

        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Edit Product
            </h1>

            <p className="mt-1 text-gray-500">
              Update the product information below.
            </p>
          </div>

          <button
            onClick={() => router.back()}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 transition hover:bg-gray-100"
          >
            ← Back
          </button>
        </div>

        {/* Form Card */}

        <section className="rounded-2xl bg-white p-6 shadow-sm md:p-8">

          <div className="mb-6 border-b pb-5">
            <h2 className="text-xl font-semibold text-gray-900">
              Product Information
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Make changes to your product details.
            </p>
          </div>

          <ProductForm
            productId={String(params.id)}
            initialData={{
              title: product.title,
              price: product.price,
              category: product.category,
              stock: product.stock,
            }}
            onSuccess={() => {
              router.push(
                `/products/${params.id}`
              );
            }}
          />
        </section>
      </div>
    </main>
  );
}