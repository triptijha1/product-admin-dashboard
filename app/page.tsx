"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  getProducts,
  searchProducts,
} from "@/services/productApi";
import SearchBar from "@/components/SearchBar";

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [total, setTotal] = useState(0);

  const router = useRouter();
  const searchParams = useSearchParams();

  // Get values from URL
  const search = searchParams.get("search") || "";

  const page = Number(searchParams.get("page")) || 1;

  const pageSize =
    Number(searchParams.get("pageSize")) || 10;

  // Total pages
  const totalPages = Math.ceil(total / pageSize);

  // Showing X-Y
  const startItem =
    total === 0
      ? 0
      : (page - 1) * pageSize + 1;

  const endItem = Math.min(
    page * pageSize,
    total
  );

  // Update URL
  const updateParams = (
    newPage: number,
    newPageSize = pageSize
  ) => {
    const params = new URLSearchParams();

    params.set("page", String(newPage));
    params.set("pageSize", String(newPageSize));

    if (search) {
      params.set("search", search);
    }

    router.push(`/?${params.toString()}`);
  };

  // Fetch products
  useEffect(() => {
    const token = localStorage.getItem("token");

    // Not logged in
    if (!token) {
      router.push("/login");
      return;
    }

    const controller = new AbortController();

    const fetchProducts = async () => {
      try {
        setError("");

        // SEARCH
        if (search.trim()) {
          const data = await searchProducts(
            search,
            controller.signal
          );

          setProducts(data.products);
          setTotal(data.total);

          return;
        }

        // NORMAL PRODUCTS
        const skip = (page - 1) * pageSize;

        const data = await getProducts(
          pageSize,
          skip
        );

        setProducts(data.products);
        setTotal(data.total);
      } catch (error: any) {

        if (error.name === "CanceledError") {
          return;
        }

        console.error(error);
        setError("Failed to load products");
      }
    };

    // Debounce
    const timer = setTimeout(() => {
      fetchProducts();
    }, 500);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [router, page, pageSize, search]);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <main>
      {/* Logout */}
      <button onClick={handleLogout}>
        Logout
      </button>

      <h1>Products</h1>

      {/* Search */}
      <SearchBar
        value={search}
        onChange={(value) => {
          const params = new URLSearchParams();

          params.set("page", "1");
          params.set("pageSize", String(pageSize));

          if (value.trim()) {
            params.set(
              "search",
              value
            );
          }

          router.push(`/?${params.toString()}`);
        }}
      />

      {/* Error */}
      {error && <p>{error}</p>}

      {/* Products */}
      {products.map((product) => (
        <div key={product.id}>
          <h2>{product.title}</h2>
          <p>${product.price}</p>
        </div>
      ))}

      {/* Pagination */}
      {!search && (
        <div>
          {/* Previous */}
          <button
            disabled={page === 1}
            onClick={() =>
              updateParams(page - 1)
            }
          >
            Previous
          </button>

          {/* Page Numbers */}
          {Array.from(
            { length: totalPages },
            (_, index) => index + 1
          ).map((pageNumber) => (
            <button
              key={pageNumber}
              disabled={
                page === pageNumber
              }
              onClick={() =>
                updateParams(pageNumber)
              }
            >
              {pageNumber}
            </button>
          ))}

          {/* Next */}
          <button
            disabled={
              page === totalPages
            }
            onClick={() =>
              updateParams(page + 1)
            }
          >
            Next
          </button>

          {/* Page Size */}
          <select
            value={pageSize}
            onChange={(e) => {
              const newSize =
                Number(e.target.value);

              updateParams(1, newSize);
            }}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>

          {/* Showing X-Y */}
          <p>
            Showing {startItem}–
            {endItem} of {total}
          </p>
        </div>
      )}
    </main>
  );
}