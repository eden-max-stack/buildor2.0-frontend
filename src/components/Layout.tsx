"use client"

import Link from "next/link";
import { Menu, X, Moon, Sun } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState<boolean | null>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // Only run once on mount
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = savedTheme === "dark" || (!savedTheme && prefersDark);

    setDarkMode(isDark);
    applyTheme(isDark);
  }, []);

  useEffect(() => {
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
        setLoading(false);
      }
    );

    // Also check on initial mount
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });

    // Cleanup subscription
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const applyTheme = (isDark: boolean) => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const toggleDarkMode = () => {
    if (darkMode === null) return;
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    applyTheme(newDarkMode);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (response.ok) {
        setUser(null);
        router.push("/auth/login");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950 transition-colors">
      {/* Subtle background code pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.01] dark:opacity-[0.02] font-mono text-xs text-brand-blue dark:text-brand-amber overflow-hidden z-0">
        <div className="whitespace-pre">{`// Builder - Master DSA Through Competition
class Algorithm {
  solve(problem) {
    // implement solution
  }
}
const builder = new Algorithm();`}</div>
      </div>

      {/* Header/Navigation */}
      <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-brand-blue/10 dark:border-gray-700 relative transition-colors">
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
              className="text-brand-dark dark:text-gray-100 hover:text-brand-blue dark:hover:text-brand-amber transition-colors font-medium"
            >
              Leaderboard
            </Link>
            <Link
              href="/questions"
              className="text-brand-dark dark:text-gray-100 hover:text-brand-blue dark:hover:text-brand-amber transition-colors font-medium"
            >
              Questions
            </Link>
            <Link
              href="/professor-dashboard"
              className="text-brand-dark dark:text-gray-100 hover:text-brand-blue dark:hover:text-brand-amber transition-colors font-medium"
            >
              Professor Portal
            </Link>
            <Link
              href="/profile"
              className="text-brand-dark dark:text-gray-100 hover:text-brand-blue dark:hover:text-brand-amber transition-colors font-medium"
            >
              Profile
            </Link>
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-brand-dark dark:text-gray-100"
              title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-brand-amber" />
              ) : (
                <Moon className="w-5 h-5 text-brand-blue" />
              )}
            </button>
            
            {/* User Greeting and Logout */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginLeft: '20px', paddingLeft: '20px', borderLeft: '1px solid #e0e0e0' }}>
              {!loading && user ? (
                <>
                  <span style={{ fontSize: '14px', fontWeight: '500' }}>
                    Hi {user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'}
                  </span>
                  <button
                    onClick={handleLogout}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#ff6b6b',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#ff5252')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ff6b6b')}
                  >
                    Logout
                  </button>
                </>
              ) : !loading ? (
                <Link href="/auth/login" style={{ fontSize: '14px', fontWeight: '500', color: '#1f2022', textDecoration: 'none' }}>
                  Sign In
                </Link>
              ) : (
                <span style={{ fontSize: '14px' }}>Loading...</span>
              )}
            </div>
          </div>

          {/* Mobile Menu Controls */}
          <div className="md:hidden flex items-center gap-2">
            {/* Dark Mode Toggle Mobile */}
            <button
              onClick={toggleDarkMode}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-brand-dark dark:text-gray-100"
              title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-brand-amber" />
              ) : (
                <Moon className="w-5 h-5 text-brand-blue" />
              )}
            </button>
            {/* Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-brand-dark dark:text-gray-100" />
              ) : (
                <Menu className="w-6 h-6 text-brand-dark dark:text-gray-100" />
              )}
            </button>
          </div>
        </nav>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-brand-blue/10 dark:border-gray-700 bg-white dark:bg-gray-900">
            <div className="px-4 py-4 space-y-3">
              <Link
                href="/leaderboard"
                className="block text-brand-dark dark:text-gray-100 hover:text-brand-blue dark:hover:text-brand-amber transition-colors font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Leaderboard
              </Link>
              <Link
                href="/questions"
                className="block text-brand-dark dark:text-gray-100 hover:text-brand-blue dark:hover:text-brand-amber transition-colors font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Questions
              </Link>
              <Link
                href="/professor-dashboard"
                className="block text-brand-dark dark:text-gray-100 hover:text-brand-blue dark:hover:text-brand-amber transition-colors font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Professor Portal
              </Link>
              <Link
                href="/profile"
                className="block text-brand-dark dark:text-gray-100 hover:text-brand-blue dark:hover:text-brand-amber transition-colors font-medium py-2"
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
      <footer className="bg-brand-dark dark:bg-gray-900 text-white mt-20 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">Builder</h3>
              <p className="text-gray-300 dark:text-gray-400">
                Master data structures and algorithms with peer competition.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-300 dark:text-gray-400">
                <li>
                  <Link href="/leaderboard" className="hover:text-white dark:hover:text-gray-100 transition">
                    Leaderboard
                  </Link>
                </li>
                <li>
                  <Link href="/questions" className="hover:text-white dark:hover:text-gray-100 transition">
                    Questions
                  </Link>
                </li>
                <li>
                  <Link href="/profile" className="hover:text-white dark:hover:text-gray-100 transition">
                    Profile
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-300 dark:text-gray-400">
                <li>
                  <a href="#" className="hover:text-white dark:hover:text-gray-100 transition">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white dark:hover:text-gray-100 transition">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white dark:hover:text-gray-100 transition">
                    About
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 dark:border-gray-800 mt-8 pt-8 text-center text-gray-300 dark:text-gray-400">
            <p>&copy; 2024 Builder. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
