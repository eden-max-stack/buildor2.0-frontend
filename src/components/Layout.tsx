"use client"

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header/Navigation */}
      <header className="sticky top-0 z-50 bg-white border-b border-brand-blue/10">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2F2ab039e8418c4b788069a9d71b2df4c2%2Fa912c4dc15484127b072473929e5071a?format=webp&width=800"
              alt="Builder"
              className="w-20 h-20 object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/leaderboard"
              className="text-brand-dark hover:text-brand-blue transition-colors font-medium"
            >
              Leaderboard
            </Link>
            <Link
              href="/questions"
              className="text-brand-dark hover:text-brand-blue transition-colors font-medium"
            >
              Questions
            </Link>
            <Link
              href="/professor-portal"
              className="text-brand-dark hover:text-brand-blue transition-colors font-medium"
            >
              Professor Portal
            </Link>
            <Link
              href="/profile"
              className="text-brand-dark hover:text-brand-blue transition-colors font-medium"
            >
              Profile
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-brand-dark" />
            ) : (
              <Menu className="w-6 h-6 text-brand-dark" />
            )}
          </button>
        </nav>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-brand-blue/10 bg-white">
            <div className="px-4 py-4 space-y-3">
              <Link
                href="/leaderboard"
                className="block text-brand-dark hover:text-brand-blue transition-colors font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Leaderboard
              </Link>
              <Link
                href="/questions"
                className="block text-brand-dark hover:text-brand-blue transition-colors font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Questions
              </Link>
              <Link
                href="/professor-portal"
                className="block text-brand-dark hover:text-brand-blue transition-colors font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Professor Portal
              </Link>
              <Link
                href="/profile"
                className="block text-brand-dark hover:text-brand-blue transition-colors font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Profile
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-brand-dark text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">Builder</h3>
              <p className="text-gray-300">
                Master data structures and algorithms with peer competition.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <Link href="/leaderboard" className="hover:text-white transition">
                    Leaderboard
                  </Link>
                </li>
                <li>
                  <Link href="/questions" className="hover:text-white transition">
                    Questions
                  </Link>
                </li>
                <li>
                  <Link href="/profile" className="hover:text-white transition">
                    Profile
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    About
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
            <p>&copy; 2024 Builder. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
