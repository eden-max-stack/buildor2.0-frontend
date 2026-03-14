"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
      setLoading(false);
    });

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
    <nav className="bg-white px-6 py-4 shadow-md">
      <div
        className="navbar-items"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div className="buildor-icon" style={{ flex: 1 }}>
          <Link href="/">
            <Image
              src="/buildor_logo_light.png"
              alt="Buildor Icon"
              width={100}
              height={200}
            />
          </Link>
        </div>

        <div
          className="navbar-links"
          style={{
            display: "flex",
            gap: "20px",
            flex: 2,
            justifyContent: "flex-end",
            alignItems: "center",
            color: "#1f2022",
          }}
        >
          <Link href="/leaderboard">Leaderboard</Link>
          <Link href="/coding-practice">Questions</Link>
          <Link href="/professor-portal">Professor Portal</Link>
        </div>
      </div>
    </nav>
  );
}
