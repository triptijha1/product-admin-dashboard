# Product Admin Dashboard

A responsive product management dashboard built with Next.js, React, Tailwind CSS, and Axios using the DummyJSON API.

## Features

- User login and logout
- Protected product dashboard
- Product listing
- Responsive desktop table and mobile cards
- Pagination with page size 10, 20, and 50
- Search with debounce
- Category filtering
- Sorting by:
  - Price
  - Rating
  - Title
- Product details page
- Add product
- Edit product
- Delete product with confirmation
- Form validation
- Loading, empty, and error states
- Retry functionality
- URL-based page, search, category, and sort state
- Request cancellation for search race-condition handling
- Prevents multiple Login/Save requests
- Shared Axios configuration
- Centralized API error handling

## Tech Stack

- Next.js 16
- React
- TypeScript
- Tailwind CSS
- Axios
- DummyJSON API

## Project Structure

```text
app/
├── login/
│   └── page.tsx
├── products/
│   └── [id]/
│       ├── page.tsx
│       └── edit/
│           └── page.tsx
└── page.tsx

components/
├── DashboardHeader.tsx
├── EmptyState.tsx
├── ErrorState.tsx
├── LoadingState.tsx
├── Pagination.tsx
├── ProductFilters.tsx
├── ProductForm.tsx
├── ProductTable.tsx
└── SearchBar.tsx

lib/
└── axios.ts

services/
└── productApi.ts

types/
└── product.ts