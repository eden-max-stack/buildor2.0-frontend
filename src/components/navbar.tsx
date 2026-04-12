"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Code2, Bell, LogOut, User, Sun, Moon, LogIn } from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  // --- States ---
  const [isDark, setIsDark] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Initialize Supabase browser client once for the component
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );

  // --- Auth State Effect ---
  useEffect(() => {
    // 1. Get initial session
    const getInitialSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user || null);
      setAuthLoading(false);
    };

    getInitialSession();

    // 2. Listen for changes (e.g., user logs in or out in another tab)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  // --- Theme Effect ---
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;

    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDark(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const navLinks = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Explore", href: "/courses" },
    { name: "Leaderboard", href: "/leaderboard" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 dark:bg-[#0a0f1c]/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left Side: Logo & Links */}
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="flex items-center gap-2 group">
              <div className="bg-brand-blue/10 p-1.5 rounded-lg group-hover:bg-brand-blue/20 transition-colors">
                <Code2 className="w-5 h-5 text-brand-blue" />
              </div>
              <span className="font-bold text-xl text-gray-900 dark:text-white tracking-tight">
                Algo<span className="text-brand-blue">Arena</span>
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right Side: Theme & Auth Controls */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Theme Toggle (Always visible) */}
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-500 hover:text-brand-amber dark:text-gray-400 dark:hover:text-brand-amber rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDark ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            {/* Auth Conditional Rendering */}
            {authLoading ? (
              // Tiny invisible spacer to prevent layout jumping while loading auth state
              <div className="w-24 h-8"></div>
            ) : user ? (
              // ---- LOGGED IN STATE ----
              <>
                <button
                  className="relative p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  title="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-red rounded-full border-2 border-white dark:border-[#0a0f1c]"></span>
                </button>

                <Link
                  href="/profile/@me"
                  className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  title="My Profile"
                >
                  <User className="w-5 h-5" />
                </Link>

                <div className="w-px h-5 bg-gray-200 dark:bg-gray-700 mx-1 hidden sm:block"></div>

                <button
                  className="p-2 text-gray-500 hover:text-brand-red dark:text-gray-400 dark:hover:text-brand-red rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  title="Logout"
                  onClick={handleLogout}
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              // ---- LOGGED OUT STATE ----
              <Link
                href="/auth/login" // Update this if your login route is different!
                className="ml-2 flex items-center gap-2 px-4 py-2 bg-brand-blue hover:bg-blue-600 text-white rounded-lg font-medium transition-colors shadow-sm text-sm"
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
