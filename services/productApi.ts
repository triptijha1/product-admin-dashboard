import api from "@/lib/axios";

import type {
  ProductFormData,
} from "@/types/product";

const STORAGE_KEY = "productOverrides";

const getStoredOverrides = () => {
  if (typeof window === "undefined") {
    return {};
  }

  const stored = localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    return {};
  }

  try {
    return JSON.parse(stored);
  } catch {
    return {};
  }
};

const saveOverride = (
  id: string,
  product: any
) => {
  if (typeof window === "undefined") {
    return;
  }

  const overrides = getStoredOverrides();

  overrides[id] = product;

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(overrides)
  );
};

export const getProducts = async (
  limit: number,
  skip: number
) => {
  const response = await api.get(
    `/products?limit=${limit}&skip=${skip}`
  );

  const data = response.data;
  const overrides = getStoredOverrides();

  data.products = data.products.map(
    (product: any) =>
      overrides[String(product.id)] || product
  );

  return data;
};

export const searchProducts = async (
  query: string,
  limit: number,
  skip: number,
  signal?: AbortSignal
) => {
  const response = await api.get(
   `/products/search?q=${encodeURIComponent(
  query
)}&limit=${limit}&skip=${skip}`,
    { signal }
  );

  const data = response.data;
  const overrides = getStoredOverrides();

  data.products = data.products.map(
    (product: any) =>
      overrides[String(product.id)] || product
  );

  return data;
};

export const getCategories = async () => {
  const response = await api.get(
    "/products/categories"
  );

  return response.data;
};

export const getProductsByCategory = async (
  category: string,
  limit: number,
  skip: number
) => {
  const response = await api.get(
    `/products/category/${category}?limit=${limit}&skip=${skip}`
  );

  const data = response.data;
  const overrides = getStoredOverrides();

  data.products = data.products.map(
    (product: any) =>
      overrides[String(product.id)] || product
  );

  return data;
};

export const getProductById = async (
  id: string
) => {
  const response = await api.get(
    `/products/${id}`
  );

  const overrides = getStoredOverrides();

  return (
    overrides[id] || response.data
  );
};

export const addProduct = async (
  product: ProductFormData
) => {
  const response = await api.post(
    "/products/add",
    product
  );

  const createdProduct = response.data;

  saveOverride(
    String(createdProduct.id),
    createdProduct
  );

  return createdProduct;
};

export const updateProduct = async (
  id: string,
  product: ProductFormData
) => {
  const response = await api.put(
    `/products/${id}`,
    product
  );

  const updatedProduct = {
    ...response.data,
    ...product,
    id: Number(id),
  };

  saveOverride(id, updatedProduct);

  return updatedProduct;
};

export const deleteProduct = async (
  id: string
) => {
  const response = await api.delete(
    `/products/${id}`
  );

  return response.data;
};