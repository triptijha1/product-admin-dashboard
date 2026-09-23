"use client";

import { useRouter } from "next/navigation";
import { deleteProduct } from "@/services/productApi";

type Product = {
  id: number;
  title: string;
  category: string;
  price: number;
  rating: number;
  stock: number;
  thumbnail: string;
};

type ProductTableProps = {
  products: Product[];
};

export default function ProductTable({
  products,
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

      alert("Product deleted successfully!");

      window.location.reload();
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
        <table>
          <thead>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Category</th>
              <th>Price</th>
              <th>Rating</th>
              <th>Stock</th>
              <th>Actions</th>
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
                <td>
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

                <td>
                  {product.title}
                </td>

                <td>
                  {product.category}
                </td>

                <td>
                  ${product.price}
                </td>

                <td>
                  ⭐ {product.rating}
                </td>

                <td>
                  {product.stock}
                </td>

                <td>
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