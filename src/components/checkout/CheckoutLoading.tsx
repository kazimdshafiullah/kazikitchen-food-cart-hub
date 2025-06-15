
import { Skeleton } from "@/components/ui/skeleton";

const CheckoutLoading = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6 max-w-2xl mx-auto">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    </div>
  );
};

export default CheckoutLoading;
