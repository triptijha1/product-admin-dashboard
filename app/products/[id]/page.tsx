"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { getProductById } from "@/services/productApi";

type Review = {
  rating: number;
  comment: string;
  reviewerName: string;
};

type Product = {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  rating: number;
  stock: number;
  images: string[];
  reviews: Review[];
};

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const [product, setProduct] =
    useState<Product | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const controller = new AbortController();

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const id = String(params.id);

        const data = await getProductById(
          id,
          controller.signal
        );

        // Ignore result if request
        // was cancelled
        if (controller.signal.aborted) {
          return;
        }

        setProduct(data);
      } catch (error: any) {
        // Ignore cancelled request
        if (
          error.name === "CanceledError" ||
          error.name === "AbortError"
        ) {
          return;
        }

        console.error(
          "Failed to fetch product:",
          error
        );

        setError(
          "Product not found"
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchProduct();

    return () => {
      controller.abort();
    };
  }, [params.id]);

  // =========================
  // Loading
  // =========================

  if (loading) {
    return (
      <main>
        <p>Loading product...</p>
      </main>
    );
  }

  // =========================
  // Error
  // =========================

  if (error || !product) {
    return (
      <main>
        <h1>Product Not Found</h1>

        <p>
          The requested product
          does not exist.
        </p>

        <button
          onClick={() =>
            router.push("/")
          }
        >
          Back to Products
        </button>
      </main>
    );
  }

  // =========================
  // Product Details
  // =========================

  return (
    <main>
      {/* Back */}

      <button
        onClick={() =>
          router.push("/")
        }
      >
        ← Back to Products
      </button>

      {/* Title */}

      <h1>{product.title}</h1>

      <p>
        Category:{" "}
        {product.category}
      </p>

      {/* Images */}

      <div>
        {product.images.map(
          (image, index) => (
            <img
              key={`${product.id}-${index}`}
              src={image}
              alt={`${product.title} ${
                index + 1
              }`}
              width={250}
              height={250}
            />
          )
        )}
      </div>

      {/* Description */}

      <h2>Description</h2>

      <p>
        {product.description}
      </p>

      {/* Price */}

      <h2>
        ${product.price}
      </h2>

      {/* Rating */}

      <p>
        ⭐ Rating:{" "}
        {product.rating}
      </p>

      {/* Stock */}

      <p>
        Stock: {product.stock}
      </p>

      {/* Reviews */}

      <h2>Reviews</h2>

      {product.reviews &&
      product.reviews.length > 0 ? (
        product.reviews.map(
          (review, index) => (
            <div
              key={`${product.id}-review-${index}`}
            >
              <strong>
                {review.reviewerName}
              </strong>

              <p>
                ⭐{" "}
                {review.rating}
              </p>

              <p>
                {review.comment}
              </p>
            </div>
          )
        )
      ) : (
        <p>
          No reviews available.
        </p>
      )}
    </main>
  );
}