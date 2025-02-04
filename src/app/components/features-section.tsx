"use client";

import { motion } from "framer-motion";
import { Inter } from "next/font/google";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Repeat, Wallet, Globe, Smartphone } from "lucide-react";
import type React from "react";
import FinancialShape from "./FinancialShape";
import { useState } from "react";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

interface FeatureProps {
  image?: string;
  icon?: React.ReactNode;
  title: string;
  description: string;
}

const ImageFeature = ({ image, title, description }: FeatureProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="group relative overflow-hidden rounded-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-[16/9] w-full">
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          objectFit="cover"
          className="transition-transform duration-300 ease-in-out group-hover:scale-110"
        />
        {/* Gradient Overlay - Always visible on mobile */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black md:hidden z-10" />
        {/* Darker gradient on hover - Only for larger screens */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black transition-opacity duration-300 ease-in-out md:block hidden" />
      </div>
      <div className="absolute inset-0 flex flex-col justify-end p-6 z-50">
        <h3 className="text-2xl font-bold text-white transition-transform duration-300 ease-in-out group-hover:-translate-y-4 translate-y-8">
          {title}
        </h3>
        <p className="text-gray-300 opacity-0 transform translate-y-4 transition-all duration-300 ease-in-out group-hover:opacity-100 group-hover:translate-y-0">
          {description}
        </p>
      </div>
      <motion.div
        className="absolute inset-0 border-2 border-white/20 rounded-xl"
        initial={false}
        animate={isHovered ? { scale: 1.05 } : { scale: 1 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
};

const IconFeature = ({ icon, title, description }: FeatureProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="flex flex-col items-center text-center p-6 bg-gray-900/50 rounded-lg backdrop-blur-sm border border-gray-800"
  >
    <div className="text-white mb-4">{icon}</div>
    <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
    <p className="text-gray-400">{description}</p>
  </motion.div>
);

const currentFeatures: FeatureProps[] = [
  {
    image: "/landing/images/expenses.png",
    title: "Expense/Income Addition",
    description: "Easily add and categorize your expenses and income.",
  },
  {
    image: "/landing/images/reports.png",
    title: "Customized Reports",
    description: "Generate detailed reports for your transactions.",
  },
  {
    image: "/landing/images/charts.png",
    title: "Graphs and Charts",
    description:
      "Visualize your spending with graph comparisons and pie charts.",
  },
  {
    image: "/landing/images/data.png",
    title: "Data Export",
    description: "Export your transaction data for external use.",
  },
];

const upcomingFeatures: FeatureProps[] = [
  {
    icon: <Repeat size={32} />,
    title: "Recurring Transactions",
    description: "Automate frequent expenses or income.",
  },
  {
    icon: <Wallet size={32} />,
    title: "Budget Management",
    description: "Set and track spending limits for specific categories.",
  },
  {
    icon: <Globe size={32} />,
    title: "Multi-Currency Support",
    description: "Handle expenses and income in different currencies.",
  },
  {
    icon: <Smartphone size={32} />,
    title: "Mobile App Integration",
    description: "Access Finflow on the go with a companion mobile app.",
  },
];

export default function FeaturesSection() {
  return (
    <section
      className={cn(
        "relative bg-black text-white py-20 overflow-hidden",
        inter.variable
      )}
      id="features"
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-gray-300">
            Powerful Features
          </h2>
          <p className="text-xl text-gray-400">
            Discover what FinFlow can do for your finances
          </p>
        </motion.div>

        <div className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {currentFeatures.map((feature, index) => (
              <ImageFeature key={index} {...feature} />
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-2xl font-semibold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-gray-200 to-gray-400">
            Coming Soon
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {upcomingFeatures.map((feature, index) => (
              <IconFeature key={index} {...feature} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
