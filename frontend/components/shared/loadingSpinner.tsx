import { Spinner } from '@/components/ui/spinner';

export default function LoadingSpinner() {
  return (
    <div className="flex flex-col gap-1 justify-center items-center">
      <Spinner className="size-7" />

      <p className="text-md font-medium">Loading...</p>
    </div>
  );
}
