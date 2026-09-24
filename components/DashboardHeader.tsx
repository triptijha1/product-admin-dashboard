"use client";

type DashboardHeaderProps = {
  onLogout: () => void;
};

export default function DashboardHeader({
  onLogout,
}: DashboardHeaderProps) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold">
          Product Admin Dashboard
        </h1>

        <p className="text-gray-500">
          Manage your products
        </p>
      </div>

      <button
        onClick={onLogout}
        className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
}