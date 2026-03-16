"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Sun, Moon, ChevronLeft, ChevronRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function Register() {
  const [step, setStep] = useState(1);
  const [darkMode, setDarkMode] = useState(true);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = useMemo(() => createClient(), []);

  const apiUrl = process.env.NEXT_PUBLIC_URL;

  // State for form fields
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    password: "",
    confirmPassword: "",
    acceptedTerms: false,
    username: "",
    avatar: "avatar1",
  });

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const handleNextStep = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      // Validate on step 1
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        return;
      }
      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters");
        return;
      }
      setError(null);
      setStep(2);
    } else {
      // Sign up user on step 2
      await signUpNewUser();
    }
  };

  async function signUpNewUser() {
    setError(null);
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            full_name: formData.fullName,
            username: formData.username,
            avatar: formData.avatar,
          },
        },
      });

      if (error) {
        setError(error.message);
        return;
      }

      if (data.user) {
        router.push(`${apiUrl}/dashboard`);
      }
    } catch (err) {
      setError(`An unexpected error occurred. Please try again. ${err}`);
    } finally {
      setLoading(false);
    }
  }

  async function signUpWithGoogle() {
    setError(null);
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setError(error.message);
      }
    } catch (err) {
      setError(`Failed to sign up with Google ${err}`);
    } finally {
      setLoading(false);
    }
  }

  async function signUpWithGitHub() {
    setError(null);
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setError(error.message);
      }
    } catch (err) {
      setError(`Failed to sign up with GitHub ${err}`);
    } finally {
      setLoading(false);
    }
  }

  const avatars = ["😊", "🚀", "🐱", "🤖"];
  const currentAvatarIndex =
    parseInt(formData.avatar.replace("avatar", "")) - 1;

  return (
    <div className={`${darkMode ? "dark" : ""}`}>
      <div className="min-h-screen flex flex-col items-center justify-center p-4 transition-colors duration-300 bg-gray-100 dark:bg-[#0B1120]">
        {/* Dark Mode Toggle */}
        <div className="absolute top-4 right-4">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
          >
            {darkMode ? (
              <Sun className="w-6 h-6 text-yellow-500" />
            ) : (
              <Moon className="w-6 h-6 text-blue-600" />
            )}
          </button>
        </div>

        <div className="w-full max-w-md p-8 shadow-xl rounded-lg border transition-all bg-white dark:bg-[#1e293b] border-gray-200 dark:border-slate-800">
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <>
              <div className="flex flex-col items-center mb-6">
                <Image
                  src={
                    darkMode
                      ? "/buildor_logo_dark.svg"
                      : "/buildor_logo_light.svg"
                  }
                  alt="Logo"
                  className="h-16 w-auto mb-4"
                />
                <h1 className="text-3xl font-bold text-center text-black dark:text-white">
                  Welcome!
                </h1>
                <p className="text-gray-500 dark:text-slate-400 mt-2">
                  Create your account to get started
                </p>
              </div>

              <form onSubmit={handleNextStep} className="space-y-4">
                {/* Error Message */}
                {error && (
                  <div className="p-3 rounded bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-800">
                    <p className="text-sm text-red-800 dark:text-red-200">
                      {error}
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-slate-300">
                    Email
                  </label>
                  <input
                    required
                    type="email"
                    className="w-full rounded px-3 py-2 border outline-none focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-[#0f172a] border-gray-300 dark:border-slate-700 text-black dark:text-white"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-slate-300">
                    Full Name
                  </label>
                  <input
                    required
                    type="text"
                    className="w-full rounded px-3 py-2 border outline-none focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-[#0f172a] border-gray-300 dark:border-slate-700 text-black dark:text-white"
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-slate-300">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      required
                      type={showPassword ? "text" : "password"}
                      className="w-full rounded px-3 py-2 border outline-none focus:ring-2 focus:ring-yellow-500 pr-10 bg-white dark:bg-[#0f172a] border-gray-300 dark:border-slate-700 text-black dark:text-white"
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 dark:text-slate-400"
                    >
                      {showPassword ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-slate-300">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      required
                      type={showConfirmPassword ? "text" : "password"}
                      className="w-full rounded px-3 py-2 border outline-none focus:ring-2 focus:ring-yellow-500 pr-10 bg-white dark:bg-[#0f172a] border-gray-300 dark:border-slate-700 text-black dark:text-white"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          confirmPassword: e.target.value,
                        })
                      }
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 dark:text-slate-400"
                    >
                      {showConfirmPassword ? (
                        <Sun size={20} />
                      ) : (
                        <Moon size={20} />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-start">
                  <input
                    required
                    id="terms"
                    type="checkbox"
                    className="mt-1 h-4 w-4 rounded text-yellow-500 border-gray-300 dark:border-slate-700 bg-white dark:bg-[#0f172a]"
                    checked={formData.acceptedTerms}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        acceptedTerms: e.target.checked,
                      })
                    }
                  />
                  <label
                    htmlFor="terms"
                    className="ml-2 block text-sm text-gray-700 dark:text-slate-300"
                  >
                    I accept the{" "}
                    <a
                      href="#"
                      className="font-semibold underline text-black dark:text-yellow-500"
                    >
                      Terms
                    </a>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full font-bold py-2 px-4 rounded transition bg-black dark:bg-yellow-500 text-white dark:text-black hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue
                </button>

                {/* Divider */}
                <div className="relative my-4 flex items-center">
                  <div className="flex-grow border-t border-gray-300 dark:border-slate-700"></div>
                  <span className="flex-shrink mx-4 text-sm text-gray-500 dark:text-slate-400">
                    Or sign up with
                  </span>
                  <div className="flex-grow border-t border-gray-300 dark:border-slate-700"></div>
                </div>

                {/* OAuth Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={signUpWithGoogle}
                    disabled={loading}
                    className="flex items-center justify-center px-4 py-2 border rounded shadow-sm text-sm font-medium transition-colors bg-white dark:bg-[#0f172a] border-gray-300 dark:border-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Google
                  </button>
                  <button
                    type="button"
                    onClick={signUpWithGitHub}
                    disabled={loading}
                    className="flex items-center justify-center px-4 py-2 border rounded shadow-sm text-sm font-medium transition-colors bg-white dark:bg-[#0f172a] border-gray-300 dark:border-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg
                      className="h-4 w-4 mr-2"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                        clipRule="evenodd"
                      />
                    </svg>
                    GitHub
                  </button>
                </div>

                <div className="mt-4 text-center text-sm">
                  <span className="text-gray-500 dark:text-slate-400">
                    Already have an account?{" "}
                  </span>
                  <Link
                    href="/auth/login"
                    className="font-semibold text-black dark:text-yellow-500 hover:underline"
                  >
                    Log in
                  </Link>
                </div>
              </form>
            </>
          )}

          {/* Step 2: Profile Setup */}
          {step === 2 && (
            <>
              <div className="flex flex-col items-center mb-8">
                <h1 className="text-2xl font-bold text-center text-black dark:text-white">
                  Setup Profile
                </h1>
                <p className="text-gray-500 dark:text-slate-400 mt-2">
                  Let`&apos;`s personalize your profile.
                </p>
              </div>

              <form onSubmit={handleNextStep} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-4 text-center text-gray-700 dark:text-slate-300">
                    Choose Avatar
                  </label>

                  <div className="flex items-center justify-center space-x-8">
                    <button
                      type="button"
                      onClick={() => {
                        const prevIndex =
                          (currentAvatarIndex - 1 + avatars.length) %
                          avatars.length;
                        setFormData({
                          ...formData,
                          avatar: `avatar${prevIndex + 1}`,
                        });
                      }}
                      className="p-3 rounded-full border transition-all bg-white dark:bg-[#0f172a] border-gray-200 dark:border-slate-700 hover:scale-110"
                    >
                      <ChevronLeft className="text-gray-600 dark:text-slate-300" />
                    </button>

                    <div className="h-32 w-32 rounded-full border-4 flex items-center justify-center text-7xl shadow-md transition-all border-black dark:border-yellow-500 bg-gray-50 dark:bg-[#0B1120]">
                      {avatars[currentAvatarIndex]}
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const nextIndex =
                          (currentAvatarIndex + 1) % avatars.length;
                        setFormData({
                          ...formData,
                          avatar: `avatar${nextIndex + 1}`,
                        });
                      }}
                      className="p-3 rounded-full border transition-all bg-white dark:bg-[#0f172a] border-gray-200 dark:border-slate-700 hover:scale-110"
                    >
                      <ChevronRight className="text-gray-600 dark:text-slate-300" />
                    </button>
                  </div>

                  <div className="flex justify-center gap-2 mt-4">
                    {avatars.map((_, idx) => (
                      <div
                        key={idx}
                        className={`h-2 w-2 rounded-full transition-colors ${currentAvatarIndex === idx ? "bg-black dark:bg-yellow-500" : "bg-gray-300 dark:bg-slate-700"}`}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-slate-300">
                    Username
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l border border-r-0 text-sm bg-gray-50 dark:bg-[#0f172a] border-gray-300 dark:border-slate-700 text-gray-500 dark:text-slate-400">
                      @
                    </span>
                    <input
                      required
                      type="text"
                      className="flex-1 rounded-r px-3 py-2 border outline-none focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-[#0f172a] border-gray-300 dark:border-slate-700 text-black dark:text-white"
                      placeholder="username"
                      onChange={(e) =>
                        setFormData({ ...formData, username: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    disabled={loading}
                    className="flex-1 font-semibold py-2 px-4 rounded border transition bg-white dark:bg-transparent border-gray-300 dark:border-slate-700 text-black dark:text-white hover:bg-gray-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 font-bold py-2 px-4 rounded transition bg-black dark:bg-yellow-500 text-white dark:text-black hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Creating..." : "Finish!"}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
