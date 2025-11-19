/**
 * Policy Card Skeleton Component
 * Loading skeleton for policy cards
 */

import Card, { CardBody } from "./Card";
import Skeleton from "./Skeleton";

export default function PolicyCardSkeleton() {
  return (
    <Card className="h-full">
      <CardBody>
        {/* Header with icon and title */}
        <div className="mb-3 flex items-start justify-between">
          <div className="flex flex-1 items-start gap-3">
            {/* Icon skeleton */}
            <Skeleton className="size-9 rounded-lg" />
            <div className="min-w-0 flex-1 space-y-2">
              {/* Title skeleton */}
              <Skeleton className="h-5 w-3/4" />
              {/* Subtitle skeleton */}
              <Skeleton className="h-4 w-1/3" />
            </div>
          </div>
        </div>

        {/* Badges skeleton */}
        <div className="mb-4 space-y-2">
          <Skeleton className="h-6 w-28 rounded-full" />
          <Skeleton className="h-6 w-32 rounded-full" />
        </div>

        {/* Action buttons skeleton */}
        <div className="flex items-center gap-2 border-t border-gray-200 pt-4">
          <Skeleton className="h-8 flex-1 rounded-md" />
          <Skeleton className="size-8 rounded-md" />
        </div>
      </CardBody>
    </Card>
  );
}
