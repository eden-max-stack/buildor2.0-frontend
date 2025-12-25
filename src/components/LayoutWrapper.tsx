"use client";

import Navbar from "./navbar";
import Sidebar from "./sidebar";

interface LayoutWrapperProps {
    children: React.ReactNode;
}

function LayoutWrapper({ children }: LayoutWrapperProps) {
  return (
    <div>
        {/* <Navbar />
        <Sidebar /> */}
        {children}
    </div>
  )
}

export default LayoutWrapper;