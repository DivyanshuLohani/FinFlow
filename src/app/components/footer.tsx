"use client";

import { motion } from "framer-motion";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
} from "lucide-react";
import type React from "react";
import Link from "next/link";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const socialLinks = [
  {
    icon: Instagram,
    href: "https://instagram.com/divyanshuxwb",
    label: "Instagram",
  },
  {
    icon: Twitter,
    href: "https://twitter.com/DivyanshuLohani",
    label: "Twitter",
  },
  {
    icon: Linkedin,
    href: "https://linkedin.com/in/divyanshulohani",
    label: "LinkedIn",
  },
];

const footerLinks = [
  { label: "About Me", href: "https://divyanshulohani.xyz" },
  { label: "Features", href: "#featues" },
  { label: "Privacy Policy", href: "/privacy" },
];

const FooterLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => (
  <Link
    href={href}
    className="text-gray-400 hover:text-white transition-colors duration-200"
  >
    {children}
  </Link>
);

const SocialIcon = ({
  icon: Icon,
  href,
  label,
}: {
  icon: React.ElementType;
  href: string;
  label: string;
}) => (
  <a
    href={href}
    aria-label={label}
    className="text-gray-400 hover:text-white transition-colors duration-200"
  >
    <Icon size={20} />
  </a>
);

export default function FooterSection() {
  return (
    <footer className={cn("bg-black text-white pt-12 pb-8", inter.variable)}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-400 to-gray-300">
              FinFlow
            </h3>
            <p className="text-gray-400">
              Empowering your financial journey with smart expense tracking and
              goal setting.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((link) => (
                <SocialIcon key={link.label} {...link} />
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-4"
          >
            <h4 className="text-lg font-semibold">Quick Links</h4>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.label}>
                  <FooterLink href={link.href}>{link.label}</FooterLink>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="space-y-4"
          >
            <h4 className="text-lg font-semibold">Contact Us</h4>
            <div className="flex items-center space-x-2">
              <Mail size={16} className="text-gray-400" />
              <a
                href="mailto:divyanshu@divyanshulohani.xyz"
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                divyanshu@divyanshulohani.xyz
              </a>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400 text-sm"
        >
          <p>&copy; {new Date().getFullYear()} FinFlow. All rights reserved.</p>
        </motion.div>
      </div>
    </footer>
  );
}
