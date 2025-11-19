/**
 * Contract Card Skeleton Component
 * Loading state for contract cards
 */

import Card, { CardBody, CardHeader } from "./Card";
import Skeleton from "./Skeleton";

export default function ContractCardSkeleton() {
  return (
    <Card data-testid="contract-card-skeleton">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton className="size-5 rounded" />
              <Skeleton className="h-6 w-3/4" />
            </div>
          </div>
        </div>
      </CardHeader>

      <CardBody className="space-y-3">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton className="size-4 rounded" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="size-4 rounded" />
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-36" />
          </div>
        </div>

        <Skeleton className="h-6 w-32 rounded-full" />

        <div className="flex items-center gap-2 border-t border-gray-100 pt-3">
          <Skeleton className="h-9 flex-1" />
          <Skeleton className="size-9" />
        </div>
      </CardBody>
    </Card>
  );
}
