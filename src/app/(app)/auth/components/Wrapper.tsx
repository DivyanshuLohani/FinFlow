"use client";

import { cn } from "@/lib/utils";
import FinancialShape from "@/app/components/FinancialShape";

export default function WrapperSignup({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-black"
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/[0.05] via-transparent to-gray-800/[0.05] blur-3xl" />

      <div className="absolute inset-0 overflow-hidden">
        <FinancialShape
          delay={0.3}
          width={600}
          height={140}
          rotate={12}
          gradient="from-gray-700/[0.15]"
          className="left-[-10%] md:left-[-5%] top-[15%] md:top-[20%]"
        />

        <FinancialShape
          delay={0.5}
          width={500}
          height={120}
          rotate={-15}
          gradient="from-gray-600/[0.15]"
          className="right-[-5%] md:right-[0%] top-[70%] md:top-[75%]"
        />

        <FinancialShape
          delay={0.4}
          width={300}
          height={80}
          rotate={-8}
          gradient="from-gray-800/[0.15]"
          className="left-[5%] md:left-[10%] bottom-[5%] md:bottom-[10%]"
        />

        <FinancialShape
          delay={0.6}
          width={200}
          height={60}
          rotate={20}
          gradient="from-gray-700/[0.15]"
          className="right-[15%] md:right-[20%] top-[10%] md:top-[15%]"
        />

        <FinancialShape
          delay={0.7}
          width={150}
          height={40}
          rotate={-25}
          gradient="from-gray-600/[0.15]"
          className="left-[20%] md:left-[25%] top-[5%] md:top-[10%]"
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 md:px-6">
        {children}
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/80 pointer-events-none" />
    </div>
  );
}
