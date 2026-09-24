import api from "@/lib/axios";

import type {
  ProductFormData,
} from "@/types/product";

export const getProducts = async (
  limit: number,
  skip: number
) => {
  const response = await api.get(
    `/products?limit=${limit}&skip=${skip}`
  );

  return response.data;
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

  return response.data;
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

  return response.data;
};

export const getProductById = async (
  id: string
) => {
  const response = await api.get(
    `/products/${id}`
  );

  return response.data;
};

export const addProduct = async (
  product: ProductFormData
) => {
  const response = await api.post(
    "/products/add",
    product
  );

  return response.data;
};

export const updateProduct = async (
  id: string,
  product: ProductFormData
) => {
  const response = await api.put(
    `/products/${id}`,
    product
  );

  return response.data;
};

export const deleteProduct = async (
  id: string
) => {
  const response = await api.delete(
    `/products/${id}`
  );

  return response.data;
};