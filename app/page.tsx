"use client";

import { useEffect, useState } from "react";
import { getProducts } from "@/services/productApi";

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();

        console.log("API DATA:", data);

        setProducts(data.products);
      } catch (error) {
        console.error("API ERROR:", error);
        setError("Failed to load products");
      }
    };

    fetchProducts();
  }, []);

  return (
    <main>
      <h1>Products</h1>

      {error && <p>{error}</p>}

      {products.map((product) => (
        <div key={product.id}>
          <h2>{product.title}</h2>
          <p>${product.price}</p>
        </div>
      ))}
    </main>
  );
}