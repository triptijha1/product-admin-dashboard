export type Product = {
  id: number;
  title: string;
  category: string;
  price: number;
  rating: number;
  stock: number;
  thumbnail: string;
};

export type ProductFormData = {
  title: string;
  price: number;
  category: string;
  stock: number;
};

export type ProductResponse = {
  id: number;
  title: string;
  category: string;
  price: number;
  stock: number;
  rating?: number;
  thumbnail?: string;
};

export type Category = {
  slug: string;
  name: string;
  url: string;
};