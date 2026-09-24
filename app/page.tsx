"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import {
  getProducts,
  searchProducts,
  getCategories,
  getProductsByCategory,
} from "@/services/productApi";

import ProductTable from "@/components/ProductTable";
import ProductForm from "@/components/ProductForm";
import Pagination from "@/components/Pagination";
import ProductFilters from "@/components/ProductFilters";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";
import EmptyState from "@/components/EmptyState";
import DashboardHeader from "@/components/DashboardHeader";
import type { Product, Category, } from "@/types/product";



const sortProducts = (
  products: Product[],
  sort: string
) => {
  const sortedProducts = [...products];

  switch (sort) {
    case "price-asc":
      sortedProducts.sort(
        (a, b) => a.price - b.price
      );
      break;

    case "price-desc":
      sortedProducts.sort(
        (a, b) => b.price - a.price
      );
      break;

    case "rating-asc":
      sortedProducts.sort(
        (a, b) => a.rating - b.rating
      );
      break;

    case "rating-desc":
      sortedProducts.sort(
        (a, b) => b.rating - a.rating
      );
      break;

    case "title-asc":
      sortedProducts.sort((a, b) =>
        a.title.localeCompare(b.title)
      );
      break;

    case "title-desc":
      sortedProducts.sort((a, b) =>
        b.title.localeCompare(a.title)
      );
      break;

    default:
      break;
  }

  return sortedProducts;
};

export default function Home() {
  // =========================
  // State
  // =========================

  const [products, setProducts] = useState<Product[]>(
    []
  );

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  const [total, setTotal] = useState(0);

  const [categories, setCategories] = useState<
    Category[]
  >([]);

  const router = useRouter();
  const searchParams = useSearchParams();

  // =========================
  // URL values
  // =========================

  const search =
    searchParams.get("search") || "";

  const category =
    searchParams.get("category") || "";

  const sort =
    searchParams.get("sort") || "";

  const pageParam = Number(
    searchParams.get("page")
  );

  const pageSizeParam = Number(
    searchParams.get("pageSize")
  );

  const page =
    Number.isInteger(pageParam) &&
    pageParam > 0
      ? pageParam
      : 1;

  const pageSize =
    [10, 20, 50].includes(pageSizeParam)
      ? pageSizeParam
      : 10;

  // =========================
  // Update URL
  // =========================

  const updateParams = useCallback(
    (
      newPage: number,
      newPageSize = pageSize
    ) => {
      const params = new URLSearchParams();

      params.set(
        "page",
        String(newPage)
      );

      params.set(
        "pageSize",
        String(newPageSize)
      );

      if (search) {
        params.set("search", search);
      }

      if (category) {
        params.set(
          "category",
          category
        );
      }

      if (sort) {
        params.set("sort", sort);
      }

      router.push(
        `/?${params.toString()}`
      );
    },
    [
      router,
      pageSize,
      search,
      category,
      sort,
    ]
  );

  // =========================
  // Pagination calculations
  // =========================

  const totalPages = Math.ceil(
    total / pageSize
  );

  const safePage =
    page > totalPages && totalPages > 0
      ? totalPages
      : page;

  const startItem =
    total === 0
      ? 0
      : (safePage - 1) * pageSize + 1;

  const endItem = Math.min(
    safePage * pageSize,
    total
  );

  // =========================
  // Fix invalid page
  // =========================

  useEffect(() => {
    if (
      totalPages > 0 &&
      page > totalPages
    ) {
      updateParams(
        totalPages,
        pageSize
      );
    }
  }, [
    totalPages,
    page,
    pageSize,
    updateParams,
  ]);

  // =========================
  // Fetch products
  // =========================

  useEffect(() => {
    const token =
      localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    const controller =
      new AbortController();

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        // =========================
        // Search
        // =========================

        if (search.trim()) {
          const data =
            await searchProducts(
              search,
              pageSize,
              (safePage - 1) * pageSize,
              controller.signal
            );

          const sortedProducts =
            sortProducts(
              data.products,
              sort
            );

          setProducts(sortedProducts);
          setTotal(data.total);

          return;
        }

        // =========================
        // Normal / Category
        // =========================

        const skip =
          (safePage - 1) * pageSize;

        let data;

        if (category) {
          data =
            await getProductsByCategory(
              category,
              pageSize,
              skip
            );
        } else {
          data =
            await getProducts(
              pageSize,
              skip
            );
        }

        const sortedProducts =
          sortProducts(
            data.products,
            sort
          );

        setProducts(sortedProducts);
        setTotal(data.total);
      } catch (error: any) {
        // Ignore cancelled requests
        if (
          error.name === "CanceledError" ||
          error.name === "AbortError" ||
          error.code === "ERR_CANCELED"
        ) {
          return;
        }

        console.error(
          "FETCH PRODUCTS ERROR:",
          error
        );

        setError(
          "Failed to load products"
        );
      } finally {
        if (
          !controller.signal.aborted
        ) {
          setLoading(false);
        }
      }
    };

    // Debounce search
    const timer = setTimeout(() => {
      fetchProducts();
    }, 500);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [
    router,
    page,
    pageSize,
    search,
    category,
    sort,
    safePage,
  ]);

  // =========================
  // Fetch categories
  // =========================

  useEffect(() => {
    const fetchCategories =
      async () => {
        try {
          const data =
            await getCategories();

          setCategories(data);
        } catch (error) {
          console.error(
            "FAILED TO LOAD CATEGORIES:",
            error
          );
        }
      };

    fetchCategories();
  }, []);

  // =========================
  // Logout
  // =========================

  const handleLogout = () => {
    localStorage.removeItem("token");

    router.push("/login");
  };

  // =========================
  // Search
  // =========================

  const handleSearchChange = (
    value: string
  ) => {
    const params =
      new URLSearchParams();

    params.set("page", "1");

    params.set(
      "pageSize",
      String(pageSize)
    );

    if (value.trim()) {
      params.set(
        "search",
        value
      );
    }

    // Search + category is not supported
    // so category is removed.

    if (sort) {
      params.set(
        "sort",
        sort
      );
    }

    router.push(
      `/?${params.toString()}`
    );
  };

  // =========================
  // Category
  // =========================

  const handleCategoryChange = (
    value: string
  ) => {
    const params =
      new URLSearchParams();

    params.set("page", "1");

    params.set(
      "pageSize",
      String(pageSize)
    );

    // Search + category is not supported
    // so search is removed.

    if (value) {
      params.set(
        "category",
        value
      );
    }

    if (sort) {
      params.set(
        "sort",
        sort
      );
    }

    router.push(
      `/?${params.toString()}`
    );
  };

  // =========================
  // Sort
  // =========================

  const handleSortChange = (
    value: string
  ) => {
    const params =
      new URLSearchParams();

    params.set("page", "1");

    params.set(
      "pageSize",
      String(pageSize)
    );

    if (search) {
      params.set(
        "search",
        search
      );
    }

    if (category) {
      params.set(
        "category",
        category
      );
    }

    if (value) {
      params.set(
        "sort",
        value
      );
    }

    router.push(
      `/?${params.toString()}`
    );
  };

  // =========================
  // Retry
  // =========================

  const handleRetry = () => {
    router.refresh();
  };

  // =========================
  // Add / Update Product
  // =========================

  const handleProductAdded = (
    createdProduct: {
      id: number;
      title: string;
      category: string;
      price: number;
      stock: number;
      rating?: number;
      thumbnail?: string;
    }
  ) => {
    const newProduct: Product = {
      id: createdProduct.id,
      title: createdProduct.title,
      category: createdProduct.category,
      price: createdProduct.price,
      rating: createdProduct.rating || 0,
      stock: createdProduct.stock,
      thumbnail:
        createdProduct.thumbnail || "",
    };

    setProducts(
      (currentProducts) => {
        const exists =
          currentProducts.some(
            (product) =>
              product.id === newProduct.id
          );

        if (exists) {
          return currentProducts.map(
            (product) =>
              product.id === newProduct.id
                ? newProduct
                : product
          );
        }

        return [
          newProduct,
          ...currentProducts,
        ];
      }
    );

    setTotal(
      (currentTotal) =>
        currentTotal + 1
    );
  };

  // =========================
  // Delete Product
  // =========================

  const handleProductDeleted = (
    id: number
  ) => {
    setProducts(
      (currentProducts) =>
        currentProducts.filter(
          (product) =>
            product.id !== id
        )
    );

    setTotal(
      (currentTotal) =>
        Math.max(
          0,
          currentTotal - 1
        )
    );
  };

  // =========================
  // UI
  // =========================

  return (
    <main className="min-h-screen bg-gray-50 p-6">

      {/* Header */}

      <DashboardHeader
        onLogout={handleLogout}
      />

      {/* Add Product */}

      <section className="mb-6 rounded-xl bg-white p-5 shadow-sm">
        <ProductForm
          onSuccess={
            handleProductAdded
          }
        />
      </section>

      {/* Search + Filters */}

      <ProductFilters
        search={search}
        category={category}
        sort={sort}
        categories={categories}
        onSearchChange={
          handleSearchChange
        }
        onCategoryChange={
          handleCategoryChange
        }
        onSortChange={
          handleSortChange
        }
      />

      {/* Loading */}

      {loading && <LoadingState />}

      {/* Error */}

      {!loading && error && (
        <ErrorState
          message={error}
          onRetry={handleRetry}
        />
      )}

      {/* Empty */}

      {!loading &&
        !error &&
        products.length === 0 && (
          <EmptyState />
      )}
      {/* Products */}

      {!loading &&
        !error &&
        products.length > 0 && (
          <>
            <section className="rounded-xl bg-white p-5 shadow-sm">
              <ProductTable
                products={products}
                onDelete={
                  handleProductDeleted
                }
              />
            </section>

            {/* Pagination */}

            <div className="mt-6">
              <Pagination
                page={page}
                totalPages={totalPages}
                pageSize={pageSize}
                startItem={startItem}
                endItem={endItem}
                total={total}
                onPageChange={(
                  newPage
                ) =>
                  updateParams(
                    newPage
                  )
                }
                onPageSizeChange={(
                  newPageSize
                ) =>
                  updateParams(
                    1,
                    newPageSize
                  )
                }
              />
            </div>
          </>
        )}
    </main>
  );
}