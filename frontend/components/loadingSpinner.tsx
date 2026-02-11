'use client';

export default function LoadingSpinner() {
  return (
    <div className="flex flex-col gap-1 justify-center items-center">
      <div className="h-6 w-6 animate-spin rounded-full border-3 border-gray-200 border-t-blue-600" />
      <p className="text-md font-medium">Loading...</p>
    </div>
  );
}
