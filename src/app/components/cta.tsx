"use client";

import { motion } from "framer-motion";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import FinancialShape from "./FinancialShape";
import { GithubIcon } from "@/components/icons/GithubIcon";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export default function CTASection() {
  return (
    <section
      className={cn(
        "relative bg-black text-white py-20 overflow-hidden",
        inter.variable
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
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-gray-300">
              Take Control of Your Finances Today
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              Join users who have transformed their financial lives with
              FinFlow. Start your journey to financial freedom now.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row justify-center items-center gap-4"
          >
            <a
              href="/auth/signup/"
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-gray-700 to-gray-900 text-white font-semibold rounded-lg shadow-lg hover:from-gray-800 hover:to-black transition duration-300 ease-in-out transform hover:-translate-y-1 flex items-center justify-center"
            >
              <span>Get Started for Free</span>
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
            <a
              href="https://github.com/DivyanshuLohani/FinFlow"
              className="w-full sm:w-auto px-4 py-4 bg-gray-800 text-white font-semibold rounded-lg shadow-lg hover:bg-gray-700 transition duration-300 ease-in-out transform hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              <GithubIcon className="ml-2 h-5 w-5" />
              Source
            </a>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-6 text-sm text-gray-500"
          >
            No credit card required.
          </motion.p>
        </div>
      </div>
    </section>
  );
}
