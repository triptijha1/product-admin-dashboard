type ErrorStateProps = {
  message: string;
  onRetry: () => void;
};

export default function ErrorState({
  message,
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="rounded-xl bg-white p-8 text-center shadow-sm">
      <p className="mb-4 text-red-500">
        {message}
      </p>

      <button
        onClick={onRetry}
        className="rounded-lg bg-blue-600 px-4 py-2 text-white"
      >
        Retry
      </button>
    </div>
  );
}