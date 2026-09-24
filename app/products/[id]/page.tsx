"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { getProductById } from "@/services/productApi";

type Review = {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
};

type Product = {
  id: number;
  title: string;
  category: string;
  description: string;
  price: number;
  rating: number;
  stock: number;
  thumbnail: string;
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

  // =========================
  // Loading
  // =========================

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 p-6">
        <div className="rounded-xl bg-white p-8 text-center shadow-sm">
          <p className="text-gray-500">
            Loading product...
          </p>
        </div>
      </main>
    );
  }

  // =========================
  // Product Not Found
  // =========================

  if (error || !product) {
    return (
      <main className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-2xl rounded-xl bg-white p-8 text-center shadow-sm">
          <h1 className="mb-3 text-2xl font-bold">
            Product Not Found
          </h1>

          <p className="mb-6 text-gray-500">
            The requested product does not exist.
          </p>

          <button
            onClick={() =>
              router.push("/")
            }
            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Back to Products
          </button>
        </div>
      </main>
    );
  }

  // =========================
  // Product Details
  // =========================

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-6xl">

        {/* Top buttons */}

        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="rounded-lg border bg-white px-4 py-2 hover:bg-gray-100"
          >
            ← Back to Products
          </button>

          <button
            onClick={() =>
              router.push(
                `/products/${product.id}/edit`
              )
            }
            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Edit Product
          </button>
        </div>

        {/* Product information */}

        <section className="rounded-xl bg-white p-6 shadow-sm">

          <div className="grid gap-8 md:grid-cols-2">

            {/* Images */}

            <div>
              <div className="mb-4 flex justify-center rounded-xl bg-gray-50 p-6">
                {product.thumbnail ? (
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="h-80 w-80 object-contain"
                  />
                ) : (
                  <div className="flex h-80 w-80 items-center justify-center text-gray-400">
                    No image
                  </div>
                )}
              </div>

              {product.images &&
                product.images.length > 0 && (
                  <div className="flex gap-3 overflow-x-auto">
                    {product.images.map(
                      (image, index) => (
                        <img
                          key={`${image}-${index}`}
                          src={image}
                          alt={`${product.title} ${
                            index + 1
                          }`}
                          className="h-20 w-20 rounded-lg border object-contain p-2"
                        />
                      )
                    )}
                  </div>
                )}
            </div>

            {/* Product details */}

            <div>
              <p className="mb-2 text-sm font-medium uppercase text-blue-600">
                {product.category}
              </p>

              <h1 className="mb-4 text-3xl font-bold">
                {product.title}
              </h1>

              <p className="mb-6 text-gray-600">
                {product.description}
              </p>

              <div className="mb-6">
                <p className="text-3xl font-bold">
                  ${product.price}
                </p>
              </div>

              <div className="space-y-3">
                <p>
                  <span className="font-semibold">
                    Rating:
                  </span>{" "}
                  ⭐ {product.rating}
                </p>

                <p>
                  <span className="font-semibold">
                    Stock:
                  </span>{" "}
                  {product.stock}
                </p>

                <p>
                  <span className="font-semibold">
                    Product ID:
                  </span>{" "}
                  {product.id}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Reviews */}

        <section className="mt-6 rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-2xl font-bold">
            Reviews
          </h2>

          {product.reviews &&
          product.reviews.length > 0 ? (
            <div className="space-y-5">
              {product.reviews.map(
                (review, index) => (
                  <div
                    key={`${review.reviewerEmail}-${index}`}
                    className="rounded-lg border p-4"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="font-semibold">
                        {review.reviewerName}
                      </h3>

                      <span>
                        ⭐ {review.rating}
                      </span>
                    </div>

                    <p className="text-gray-600">
                      {review.comment}
                    </p>

                    <p className="mt-2 text-sm text-gray-400">
                      {new Date(
                        review.date
                      ).toLocaleDateString()}
                    </p>
                  </div>
                )
              )}
            </div>
          ) : (
            <p className="text-gray-500">
              No reviews available.
            </p>
          )}
        </section>

      </div>
    </main>
  );
}