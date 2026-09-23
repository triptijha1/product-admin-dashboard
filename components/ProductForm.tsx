"use client";

import { useState } from "react";

import {
  addProduct,
  updateProduct,
} from "@/services/productApi";

type ProductData = {
  title: string;
  price: number;
  category: string;
  stock: number;
};

type Product = ProductData & {
  id: number;
  rating?: number;
  thumbnail?: string;
};

type ProductFormProps = {
  productId?: string;

  initialData?: ProductData;

  onSuccess?: (product: Product) => void;
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

    // Prevent multiple requests
    if (saving) return;

    // =========================
    // Validation
    // =========================

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    if (!price || Number(price) <= 0) {
      setError(
        "Price must be greater than 0"
      );
      return;
    }

    if (!category.trim()) {
      setError("Category is required");
      return;
    }

    if (!stock || Number(stock) < 0) {
      setError(
        "Stock cannot be negative"
      );
      return;
    }

    try {
      setSaving(true);

      const data = {
        title: title.trim(),
        price: Number(price),
        category: category.trim(),
        stock: Number(stock),
      };

      let product;

      // =========================
      // EDIT
      // =========================

      if (isEdit) {
        product = await updateProduct(
          productId!,
          data
        );

        console.log(
          "PRODUCT UPDATED:",
          product
        );
      }

      // =========================
      // ADD
      // =========================

      else {
        product = await addProduct(data);

        console.log(
          "PRODUCT CREATED:",
          product
        );
      }

      // Send product to parent
      onSuccess?.(product);

      // Reset only after ADD
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
    <form onSubmit={handleSubmit}>
      <h2>
        {isEdit
          ? "Edit Product"
          : "Add Product"}
      </h2>

      {error && (
        <p>{error}</p>
      )}

      <input
        type="text"
        placeholder="Product title"
        value={title}
        onChange={(e) =>
          setTitle(e.target.value)
        }
      />

      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) =>
          setPrice(e.target.value)
        }
      />

      <input
        type="text"
        placeholder="Category"
        value={category}
        onChange={(e) =>
          setCategory(e.target.value)
        }
      />

      <input
        type="number"
        placeholder="Stock"
        value={stock}
        onChange={(e) =>
          setStock(e.target.value)
        }
      />

      <button
        type="submit"
        disabled={saving}
      >
        {saving
          ? "Saving..."
          : isEdit
          ? "Update Product"
          : "Add Product"}
      </button>
    </form>
  );
}