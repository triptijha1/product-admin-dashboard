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
        const data = await getProductById(
          String(params.id)
        );

        setProduct(data);
      } catch (error) {
        console.error(error);
        setError("Product not found");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.id]);

  if (loading) {
    return <p>Loading product...</p>;
  }

  if (error || !product) {
    return <p>{error}</p>;
  }

  return (
    <main>
      <button onClick={() => router.back()}>
        ← Back
      </button>

      <ProductForm
        productId={String(params.id)}
        initialData={{
          title: product.title,
          price: product.price,
          category: product.category,
          stock: product.stock,
        }}
        onSuccess={() => router.push(`/products/${params.id}`)}
      />
    </main>
  );
}