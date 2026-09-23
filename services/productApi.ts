import api from "@/lib/axios";

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
  signal?: AbortSignal
) => {
  const response = await api.get(
    `/products/search?q=${encodeURIComponent(query)}`,
    {
      signal,
    }
  );

  return response.data;
};