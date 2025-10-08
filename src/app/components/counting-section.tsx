"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { IndianRupee, TrendingUp, Users } from "lucide-react";
import { getHomePageData } from "../actions";
import FinancialShape from "./FinancialShape";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

interface CounterProps {
  end: number;
  duration: number;
  prefix?: string;
  suffix?: string;
}

const Counter: React.FC<CounterProps> = ({
  end,
  duration,
  prefix = "",
  suffix = "",
}) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    let startTime: number;
    let animationFrame: number;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        animationFrame = requestAnimationFrame(step);
      }
    };

    animationFrame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrame);
  }, [isVisible, end, duration]);

  return (
    <span ref={ref}>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

export default function CounterSection() {
  const [stats, setStats] = useState<
    Array<{
      name: string;
      value: number;
      icon: any;
      prefix: string;
      suffix: string;
    }>
  >([]);

  useEffect(() => {
    async function fetchData() {
      const { expenses, income, users } = await getHomePageData();
      setStats([
        {
          name: "Money Spent",
          value: 230506,
          icon: IndianRupee,
          prefix: "₹",
          suffix: "+",
        },
        {
          name: "Income Registered",
          value: 221007,
          icon: TrendingUp,
          prefix: "₹",
          suffix: "+",
        },
        {
          name: "Total Registered Users",
          value: users,
          icon: Users,
          prefix: "",
          suffix: "+",
        },
      ]);
    }
    fetchData();
  }, []);

  return (
    <section
      className={cn(
        "relative min-h-screen flex items-center bg-black py-24 overflow-hidden",
        inter.variable
      )}
    >
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute w-full h-full"
        >
          <FinancialShape
            delay={0.3}
            width={800}
            height={200}
            rotate={15}
            gradient="from-gray-700/[0.15]"
            className="absolute left-[-20%] top-[10%]"
          />
          <FinancialShape
            delay={0.5}
            width={700}
            height={180}
            rotate={-20}
            gradient="from-gray-600/[0.15]"
            className="absolute right-[-15%] top-[60%]"
          />
        </motion.div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-24"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-gray-300">
            FinFlow in Numbers
          </h2>
          <p className="text-xl md:text-2xl text-gray-400">
            See the impact we already have made in the financial landscape
          </p>
        </motion.div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 flex-wrap space-y-8 sm:space-y-0 relative z-10">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="flex flex-col items-center text-center group "
            >
              <div className="mb-6">
                <stat.icon
                  size={48}
                  className="text-gray-400 group-hover:text-white transition-colors duration-300"
                />
              </div>
              <h3 className="text-5xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-gray-300">
                <Counter
                  end={stat.value}
                  duration={2000}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                />
              </h3>
              <p className="text-xl text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                {stat.name}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
