"use client";

import { useState } from "react";

import {
  addProduct,
  updateProduct,
} from "@/services/productApi";

import type {
  ProductFormData,
  ProductResponse,
} from "@/types/product";

type ProductFormProps = {
  productId?: string;
  initialData?: ProductFormData;
  onSuccess?: (product: ProductResponse) => void;
};

export default function ProductForm({
  productId,
  initialData,
  onSuccess,
}: ProductFormProps) {
  const [title, setTitle] = useState(
    initialData?.title || ""
  );

  const [price, setPrice] = useState(
    initialData?.price?.toString() || ""
  );

  const [category, setCategory] = useState(
    initialData?.category || ""
  );

  const [stock, setStock] = useState(
    initialData?.stock?.toString() || ""
  );

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const isEdit = Boolean(productId);

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setError("");

    if (saving) return;

    // Validation

    if (!title.trim()) {
      setError("Product title is required");
      return;
    }

    if (!price || Number(price) <= 0) {
      setError("Price must be greater than 0");
      return;
    }

    if (!category.trim()) {
      setError("Category is required");
      return;
    }

    if (!stock || Number(stock) < 0) {
      setError("Stock cannot be negative");
      return;
    }

    try {
      setSaving(true);

      const data: ProductFormData = {
        title: title.trim(),
        price: Number(price),
        category: category.trim(),
        stock: Number(stock),
      };

      let product: ProductResponse;

      if (isEdit) {
        product = await updateProduct(
          productId!,
          data
        );
      } else {
        product = await addProduct(data);
      }

      onSuccess?.(product);

      if (!isEdit) {
        setTitle("");
        setPrice("");
        setCategory("");
        setStock("");
      }

      alert(
        isEdit
          ? "Product updated successfully!"
          : "Product added successfully!"
      );
    } catch (error) {
      console.error(
        isEdit
          ? "UPDATE PRODUCT ERROR:"
          : "ADD PRODUCT ERROR:",
        error
      );

      setError(
        isEdit
          ? "Failed to update product"
          : "Failed to add product"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* Heading */}

      <div>
        <h2 className="text-xl font-semibold text-gray-900">
          {isEdit
            ? "Edit Product"
            : "Add Product"}
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          {isEdit
            ? "Update the product details."
            : "Add a new product to your inventory."}
        </p>
      </div>

      {/* Error */}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-sm text-red-600">
            {error}
          </p>
        </div>
      )}

      {/* Title */}

      <div>
        <label
          htmlFor="title"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Product Title
        </label>

        <input
          id="title"
          type="text"
          placeholder="Enter product title"
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
          className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      {/* Price + Category */}

      <div className="grid gap-5 md:grid-cols-2">

        {/* Price */}

        <div>
          <label
            htmlFor="price"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Price
          </label>

          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
              $
            </span>

            <input
              id="price"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={price}
              onChange={(e) =>
                setPrice(e.target.value)
              }
              className="w-full rounded-lg border border-gray-300 py-3 pl-8 pr-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        {/* Category */}

        <div>
          <label
            htmlFor="category"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Category
          </label>

          <input
            id="category"
            type="text"
            placeholder="e.g. beauty"
            value={category}
            onChange={(e) =>
              setCategory(e.target.value)
            }
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      {/* Stock */}

      <div>
        <label
          htmlFor="stock"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Stock
        </label>

        <input
          id="stock"
          type="number"
          min="0"
          placeholder="Enter stock quantity"
          value={stock}
          onChange={(e) =>
            setStock(e.target.value)
          }
          className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      {/* Button */}

      <div className="flex justify-end border-t pt-5">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving
            ? "Saving..."
            : isEdit
            ? "Update Product"
            : "Add Product"}
        </button>
      </div>
    </form>
  );
}