import React from "react";

const SkeletonLoader = () => {
  return (
    <div className="space-y-2 animate-pulse">
      {/* Input Field Skeleton */}
      <div className="flex h-9 items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 w-full sm:w-[180px]">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
      </div>

      {/* Card Grid Skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className="rounded-xl border bg-card text-card-foreground shadow"
          >
            <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="p-6 pt-0">
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkeletonLoader;
