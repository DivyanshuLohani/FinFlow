"use client";
import React from "react";
import { RecentTransactionsSkeleton } from "./RecentTransactionsSkeleton";
import SkeletonLoader from "./SkeletonLoaderT";

export default function DasboardSkeleton() {
  return (
    <>
      <SkeletonLoader />
      <RecentTransactionsSkeleton />
    </>
  );
}
