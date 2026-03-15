import React from "react";
import Navbar from "./navbar"; // Adjust the import path if your Navbar is in a different folder

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-[#0a0f1c]">
      {/* 1. Render the top navigation */}
      <Navbar />

      {/* 2. Render the specific page content inside the main tag */}
      <main className="flex-grow">{children}</main>
    </div>
  );
}
