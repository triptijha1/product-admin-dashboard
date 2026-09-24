"use client";

import { useRouter } from "next/navigation";
import { deleteProduct } from "@/services/productApi";
import type { Product } from "@/types/product";



type ProductTableProps = {
  products: Product[];
  onDelete: (id: number) => void;
};

export default function ProductTable({
  products,
  onDelete,
}: ProductTableProps) {
  const router = useRouter();

  // =========================
  // Open Product Details
  // =========================

  const handleProductClick = (id: number) => {
    router.push(`/products/${id}`);
  };

  // =========================
  // Delete Product
  // =========================

  const handleDelete = async (
    e: React.MouseEvent,
    id: number
  ) => {
    e.stopPropagation();

    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    try {
      await deleteProduct(String(id));

      onDelete(id);

      alert("Product deleted successfully!");

    } catch (error) {
      console.error(
        "DELETE PRODUCT ERROR:",
        error
      );

      alert("Failed to delete product");
    }
  };

  return (
    <>
      {/* =========================
          Desktop Table
      ========================= */}

      <div className="hidden md:block">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left">Image</th>
              <th className="px-4 py-3 text-left">Title</th>
              <th className="px-4 py-3 text-left">Category</th>
              <th className="px-4 py-3 text-left">Price</th>
              <th className="px-4 py-3 text-left">Rating</th>
              <th className="px-4 py-3 text-left">Stock</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr
                key={`${product.id}-${product.title}`}
                onClick={() =>
                  handleProductClick(product.id)
                }
                className="cursor-pointer"
              >
                <td className="px-4 py-3">
                  {product.thumbnail ? (
                    <img
                      src={product.thumbnail}
                      alt={product.title}
                      width={60}
                      height={60}
                    />
                  ) : (
                    <span>No image</span>
                  )}
                </td>

                <td className="px-4 py-3">
                  {product.title}
                </td>

                <td className="px-4 py-3">
                  {product.category}
                </td>

                <td className="px-4 py-3">
                  ${product.price}
                </td>

                <td className="px-4 py-3">
                  ⭐ {product.rating}
                </td>

                <td className="px-4 py-3">
                  {product.stock}
                </td>

                <td className="px-4 py-3">
                  <button
                    onClick={(e) =>
                      handleDelete(
                        e,
                        product.id
                      )
                    }
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* =========================
          Mobile Cards
      ========================= */}

      <div className="md:hidden">
        {products.map((product) => (
          <div
            key={`${product.id}-${product.title}`}
            onClick={() =>
              handleProductClick(
                product.id
              )
            }
            className="cursor-pointer"
          >
            {product.thumbnail ? (
              <img
                src={product.thumbnail}
                alt={product.title}
                width={100}
                height={100}
              />
            ) : (
              <span>No image</span>
            )}

            <h2>
              {product.title}
            </h2>

            <p>
              Category:{" "}
              {product.category}
            </p>

            <p>
              ${product.price}
            </p>

            <p>
              ⭐ {product.rating}
            </p>

            <p>
              Stock: {product.stock}
            </p>

            <button
              onClick={(e) =>
                handleDelete(
                  e,
                  product.id
                )
              }
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </>
  );
}