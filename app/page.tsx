"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import {
  getProducts,
  searchProducts,
  getCategories,
  getProductsByCategory,
} from "@/services/productApi";

import SearchBar from "@/components/SearchBar";
import ProductTable from "@/components/ProductTable";
import ProductForm from "@/components/ProductForm";

type Category = {
  slug: string;
  name: string;
  url: string;
};

type Product = {
  id: number;
  title: string;
  category: string;
  price: number;
  rating: number;
  stock: number;
  thumbnail: string;
};

export default function Home() {
  // =========================
  // State
  // =========================

  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);

  const router = useRouter();
  const searchParams = useSearchParams();

  // =========================
  // Get values from URL
  // =========================

  const search = searchParams.get("search") || "";

  const category = searchParams.get("category") || "";

  const sort = searchParams.get("sort") || "";

  const page =
    Number(searchParams.get("page")) || 1;

  const pageSize =
    Number(searchParams.get("pageSize")) || 10;

  // =========================
  // Pagination
  // =========================

  const totalPages = Math.ceil(
    total / pageSize
  );

  const startItem =
    total === 0
      ? 0
      : (page - 1) * pageSize + 1;

  const endItem = Math.min(
    page * pageSize,
    total
  );

  // =========================
  // Sort products
  // =========================

  const sortProducts = (
    products: Product[]
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

  // =========================
  // Update URL
  // =========================

  const updateParams = (
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
      params.set("category", category);
    }

    if (sort) {
      params.set("sort", sort);
    }

    router.push(
      `/?${params.toString()}`
    );
  };

  // =========================
  // Fetch products
  // =========================

  useEffect(() => {
    const token =
      localStorage.getItem("token");

    // Not logged in
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
        // SEARCH
        // =========================

        if (search.trim()) {
          const data =
            await searchProducts(
              search,
              controller.signal
            );

          const sortedProducts =
            sortProducts(data.products);

          setProducts(sortedProducts);
          setTotal(data.total);

          return;
        }

        // =========================
        // Pagination skip
        // =========================

        const skip =
          (page - 1) * pageSize;

        let data;

        // =========================
        // CATEGORY
        // =========================

        if (category) {
          data =
            await getProductsByCategory(
              category,
              pageSize,
              skip
            );
        } else {
          // =========================
          // ALL PRODUCTS
          // =========================

          data =
            await getProducts(
              pageSize,
              skip
            );
        }

        // =========================
        // APPLY SORT
        // =========================

        const sortedProducts =
          sortProducts(data.products);

        setProducts(sortedProducts);
        setTotal(data.total);
      } catch (error: any) {
        // Ignore cancelled requests
        if (
          error.name === "CanceledError" ||
          error.name === "AbortError"
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
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    // =========================
    // Debounce
    // =========================

    const timer = setTimeout(() => {
      fetchProducts();
    }, 500);

    return () => {
      clearTimeout(timer);

      // Cancel previous request
      controller.abort();
    };
  }, [
    router,
    page,
    pageSize,
    search,
    category,
    sort,
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
            "Failed to load categories:",
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
  // Search change
  // =========================

  const handleSearchChange = (
    value: string
  ) => {
    const params =
      new URLSearchParams();

    // Search starts from page 1
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

    // Search + category API
    // combination is not supported,
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
  // Category change
  // =========================

  const handleCategoryChange = (
    value: string
  ) => {
    const params =
      new URLSearchParams();

    // Category starts from page 1
    params.set("page", "1");

    params.set(
      "pageSize",
      String(pageSize)
    );

    // Search + category API
    // combination is not supported,
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
  // Sort change
  // =========================

  const handleSortChange = (
    value: string
  ) => {
    const params =
      new URLSearchParams();

    // Sort starts from page 1
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
    // Re-run the current URL state
    router.refresh();
  };

  // =========================
  // UI
  // =========================

  return (
    <main>
      {/* =========================
          Logout
      ========================= */}

      <button
        onClick={handleLogout}
      >
        Logout
      </button>

      <h1>Products</h1>

      {/* =========================
          Add Product
      ========================= */}

      <ProductForm
        onSuccess={(createdProduct) => {
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

          setProducts((currentProducts) => {
          const exists = currentProducts.some(
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
        });

          setTotal((currentTotal) =>
            currentTotal + 1
          );
        }}
      />

      {/* =========================
          Search
      ========================= */}

      <SearchBar
        value={search}
        onChange={
          handleSearchChange
        }
      />

      {/* =========================
          Category
      ========================= */}

      <select
        value={category}
        onChange={(e) =>
          handleCategoryChange(
            e.target.value
          )
        }
      >
        <option value="">
          All Categories
        </option>

        {categories.map(
          (item) => (
            <option
              key={item.slug}
              value={item.slug}
            >
              {item.name}
            </option>
          )
        )}
      </select>

      {/* =========================
          Sort
      ========================= */}

      <select
        value={sort}
        onChange={(e) =>
          handleSortChange(
            e.target.value
          )
        }
      >
        <option value="">
          Sort By
        </option>

        <option value="price-asc">
          Price: Low → High
        </option>

        <option value="price-desc">
          Price: High → Low
        </option>

        <option value="rating-asc">
          Rating: Low → High
        </option>

        <option value="rating-desc">
          Rating: High → Low
        </option>

        <option value="title-asc">
          Title: A → Z
        </option>

        <option value="title-desc">
          Title: Z → A
        </option>
      </select>

      {/* =========================
          Loading
      ========================= */}

      {loading && (
        <div>
          <p>Loading products...</p>
        </div>
      )}

      {/* =========================
          Error
      ========================= */}

      {!loading && error && (
        <div>
          <p>{error}</p>

          <button
            onClick={handleRetry}
          >
            Retry
          </button>
        </div>
      )}

      {/* =========================
          Empty State
      ========================= */}

      {!loading &&
        !error &&
        products.length === 0 && (
          <div>
            <p>
              No products found.
            </p>
          </div>
        )}

      {/* =========================
          Products
      ========================= */}

      {!loading &&
        !error &&
        products.length > 0 && (
          <ProductTable
            products={products}
          />
        )}

      {/* =========================
          Pagination
      ========================= */}

      {!loading &&
        !error &&
        products.length > 0 &&
        !search && (
          <div>
            {/* Previous */}

            <button
              disabled={page === 1}
              onClick={() =>
                updateParams(
                  page - 1
                )
              }
            >
              Previous
            </button>

            {/* Page Numbers */}

            {Array.from(
              {
                length:
                  totalPages,
              },
              (_, index) =>
                index + 1
            ).map(
              (pageNumber) => (
                <button
                  key={
                    pageNumber
                  }
                  disabled={
                    page ===
                    pageNumber
                  }
                  onClick={() =>
                    updateParams(
                      pageNumber
                    )
                  }
                >
                  {pageNumber}
                </button>
              )
            )}

            {/* Next */}

            <button
              disabled={
                page ===
                totalPages
              }
              onClick={() =>
                updateParams(
                  page + 1
                )
              }
            >
              Next
            </button>

            {/* Page Size */}

            <select
              value={pageSize}
              onChange={(e) => {
                const newSize =
                  Number(
                    e.target.value
                  );

                updateParams(
                  1,
                  newSize
                );
              }}
            >
              <option value={10}>
                10
              </option>

              <option value={20}>
                20
              </option>

              <option value={50}>
                50
              </option>
            </select>

            {/* Showing X-Y */}

            <p>
              Showing{" "}
              {startItem}–
              {endItem} of{" "}
              {total}
            </p>
          </div>
        )}
    </main>
  );
}