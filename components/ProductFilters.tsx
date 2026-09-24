"use client";

import SearchBar from "@/components/SearchBar";

type ProductFiltersProps = {
  search: string;
  category: string;
  sort: string;
  categories: {
    slug: string;
    name: string;
    url: string;
  }[];
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onSortChange: (value: string) => void;
};

export default function ProductFilters({
  search,
  category,
  sort,
  categories,
  onSearchChange,
  onCategoryChange,
  onSortChange,
}: ProductFiltersProps) {
  return (
    <section className="mb-6 flex flex-col gap-3 rounded-xl bg-white p-5 shadow-sm md:flex-row">

      <div className="flex-1">
        <SearchBar
          value={search}
          onChange={onSearchChange}
        />
      </div>

      <select
        value={category}
        onChange={(e) =>
          onCategoryChange(e.target.value)
        }
        className="rounded-lg border px-3 py-2"
      >
        <option value="">All Categories</option>

        {categories.map((item) => (
          <option
            key={item.slug}
            value={item.slug}
          >
            {item.name}
          </option>
        ))}
      </select>

      <select
        value={sort}
        onChange={(e) =>
          onSortChange(e.target.value)
        }
        className="rounded-lg border px-3 py-2"
      >
        <option value="">Sort By</option>
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

    </section>
  );
}