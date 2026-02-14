"use client";

import Navbar from "./navbar";
import Sidebar from "./sidebar";
import { ReactNode } from "react";

interface LayoutWrapperProps {
    children: ReactNode;
}

const LayoutWrapper = ({ children }: LayoutWrapperProps) => {
  return (
    <div>
        {/* <Navbar />
        <Sidebar /> */}
        {children}
    </div>
  )
}

export default LayoutWrapper;