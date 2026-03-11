import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { CartProvider } from "@/lib/CartContext";
import { BranchProvider } from "@/lib/BranchContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Budget Wear Limited | Premium Thrift Marketplace",
  description: "High-end multi-branch thrift e-commerce platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans`}
      >
        <BranchProvider>
          <CartProvider>
            <Toaster position="top-center" richColors />
            {children}
          </CartProvider>
        </BranchProvider>
      </body>
    </html>
  );
}
