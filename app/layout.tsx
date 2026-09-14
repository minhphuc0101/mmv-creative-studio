import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MMV Creative Studio - Dealer Marketing AI Platform",
  description: "Enterprise marketing photo generation tool for Mitsubishi Motors Vietnam dealership sales consultants powered by Nano Banana Pro 2 and Gemini.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-[#F8FAFC]">
        {children}
      </body>
    </html>
  );
}
