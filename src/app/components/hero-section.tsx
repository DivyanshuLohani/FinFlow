"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import FinancialShape from "./FinancialShape";
import Link from "next/link";

export default function HeroSection({
  badge = "FinFlow",
  title1 = "Track Cashflow,",
  title2 = "Save Money",
}: {
  badge?: string;
  title1?: string;
  title2?: string;
}) {
  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        delay: 0.5 + i * 0.2,
        ease: [0.25, 0.4, 0.25, 1],
      },
    }),
  };
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
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            custom={0}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] mb-8 md:mb-12"
          >
            <Image
              src="/images/logo.png"
              alt="FinFlow"
              width={50}
              height={50}
              className="rounded-full"
            />
            <span className="text-xl text-white/60 tracking-wide font-medium">
              {badge}
            </span>
          </motion.div>

          <motion.div
            custom={1}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
          >
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold mb-6 md:mb-8 tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/80">
                {title1}
              </span>
              <br />
              <span
                className={cn(
                  "bg-clip-text text-transparent bg-gradient-to-r from-gray-300 via-white/90 to-gray-300",
                  "font-extrabold"
                )}
              >
                {title2}
              </span>
            </h1>
          </motion.div>

          <motion.div
            custom={2}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
          >
            <p className="text-base sm:text-lg md:text-xl text-white/40 mb-8 leading-relaxed font-light tracking-wide max-w-xl mx-auto px-4">
              Elevate your financial management with {"FinFlow's"} sophisticated
              expense tracking and goal-setting tools.
            </p>
          </motion.div>

          <motion.div
            custom={3}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
          >
            <Link
              href={"/auth/signup/"}
              className="px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-900 text-white font-semibold rounded-lg shadow-lg hover:from-gray-800 hover:to-black transition duration-300 ease-in-out transform hover:-translate-y-1 border border-gray-600"
            >
              Start Your Financial Journey
            </Link>
          </motion.div>
        </div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/80 pointer-events-none" />
    </div>
  );
}
