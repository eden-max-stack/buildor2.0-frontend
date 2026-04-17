"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  User,
  GraduationCap,
  Briefcase,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function Register() {
  const [step, setStep] = useState(1);
  const [darkMode, setDarkMode] = useState(true);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = useMemo(() => createClient(), []);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Updated to match your new requirements
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
    acceptedTerms: false,
    role: "STUDENT", // Default role
    avatar: "avatar1",
  });

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const handleNextStep = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
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
            // This data object is passed to our Postgres Trigger!
            first_name: formData.firstName,
            last_name: formData.lastName,
            role: formData.role,
            avatar_url: formData.avatar,
          },
        },
      });

      if (error) {
        setError(error.message);
        return;
      }

      if (data.user) {
        router.push("/");
      }
    } catch (err) {
      setError(`An unexpected error occurred. Please try again. ${err}`);
    } finally {
      setLoading(false);
    }
  }

  // OAuth Providers (Note: Google/GitHub won't ask for a role upfront.
  // Our database trigger will default them to 'STUDENT')
  async function signUpWithOAuth(provider: "google" | "github") {
    setError(null);
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) setError(error.message);
    } catch (err) {
      setError(`Failed to sign up with ${provider}`);
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
                  width={100}
                  height={40}
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
                {error && (
                  <div className="p-3 rounded bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-800">
                    <p className="text-sm text-red-800 dark:text-red-200">
                      {error}
                    </p>
                  </div>
                )}

                {/* Role Selection */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-slate-300">
                    I am a...
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, role: "STUDENT" })
                      }
                      className={`flex items-center justify-center gap-2 py-2 border rounded-lg transition-all ${
                        formData.role === "STUDENT"
                          ? "bg-brand-blue/10 border-brand-blue text-brand-blue"
                          : "bg-transparent border-gray-300 dark:border-slate-700 text-gray-600 dark:text-gray-400"
                      }`}
                    >
                      <GraduationCap className="w-4 h-4" /> Student
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, role: "TRAINER" })
                      }
                      className={`flex items-center justify-center gap-2 py-2 border rounded-lg transition-all ${
                        formData.role === "TRAINER"
                          ? "bg-brand-amber/10 border-brand-amber text-brand-amber"
                          : "bg-transparent border-gray-300 dark:border-slate-700 text-gray-600 dark:text-gray-400"
                      }`}
                    >
                      <Briefcase className="w-4 h-4" /> Trainer
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-slate-300">
                      First Name
                    </label>
                    <input
                      required
                      type="text"
                      className="w-full rounded px-3 py-2 border outline-none focus:ring-2 focus:ring-brand-blue bg-white dark:bg-[#0f172a] border-gray-300 dark:border-slate-700 text-black dark:text-white"
                      placeholder="Alan"
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-slate-300">
                      Last Name
                    </label>
                    <input
                      required
                      type="text"
                      className="w-full rounded px-3 py-2 border outline-none focus:ring-2 focus:ring-brand-blue bg-white dark:bg-[#0f172a] border-gray-300 dark:border-slate-700 text-black dark:text-white"
                      placeholder="Turing"
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-slate-300">
                    Email
                  </label>
                  <input
                    required
                    type="email"
                    className="w-full rounded px-3 py-2 border outline-none focus:ring-2 focus:ring-brand-blue bg-white dark:bg-[#0f172a] border-gray-300 dark:border-slate-700 text-black dark:text-white"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
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
                      className="w-full rounded px-3 py-2 border outline-none focus:ring-2 focus:ring-brand-blue pr-10 bg-white dark:bg-[#0f172a] border-gray-300 dark:border-slate-700 text-black dark:text-white"
                      placeholder="Create a password"
                      value={formData.password}
                      autoComplete="new-password"
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
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
                      className="w-full rounded px-3 py-2 border outline-none focus:ring-2 focus:ring-brand-blue pr-10 bg-white dark:bg-[#0f172a] border-gray-300 dark:border-slate-700 text-black dark:text-white"
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
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
                    >
                      {showConfirmPassword ? (
                        <Sun size={20} />
                      ) : (
                        <Moon size={20} />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full font-bold py-2 px-4 rounded transition bg-brand-blue text-white hover:bg-blue-600 disabled:opacity-50"
                >
                  Continue
                </button>

                <div className="relative my-4 flex items-center">
                  <div className="flex-grow border-t border-gray-300 dark:border-slate-700"></div>
                  <span className="flex-shrink mx-4 text-sm text-gray-500 dark:text-slate-400">
                    Or sign up with
                  </span>
                  <div className="flex-grow border-t border-gray-300 dark:border-slate-700"></div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => signUpWithOAuth("google")}
                    disabled={loading}
                    className="flex items-center justify-center px-4 py-2 border rounded shadow-sm text-sm font-medium transition-colors bg-white dark:bg-[#0f172a] border-gray-300 dark:border-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 disabled:opacity-50"
                  >
                    Google
                  </button>
                  <button
                    type="button"
                    onClick={() => signUpWithOAuth("github")}
                    disabled={loading}
                    className="flex items-center justify-center px-4 py-2 border rounded shadow-sm text-sm font-medium transition-colors bg-white dark:bg-[#0f172a] border-gray-300 dark:border-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 disabled:opacity-50"
                  >
                    GitHub
                  </button>
                </div>

                <div className="mt-4 text-center text-sm">
                  <span className="text-gray-500 dark:text-slate-400">
                    Already have an account?{" "}
                  </span>
                  <Link
                    href="/auth/login"
                    className="font-semibold text-brand-blue hover:underline"
                  >
                    Log in
                  </Link>
                </div>
              </form>
            </>
          )}

          {/* Step 2: Profile Setup (Avatar Selection) */}
          {step === 2 && (
            <>
              <div className="flex flex-col items-center mb-8">
                <h1 className="text-2xl font-bold text-center text-black dark:text-white">
                  Setup Profile
                </h1>
                <p className="text-gray-500 dark:text-slate-400 mt-2">
                  Let&apos;s personalize your profile.
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

                    <div className="h-32 w-32 rounded-full border-4 flex items-center justify-center text-7xl shadow-md transition-all border-brand-blue bg-gray-50 dark:bg-[#0B1120]">
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
                        className={`h-2 w-2 rounded-full transition-colors ${currentAvatarIndex === idx ? "bg-brand-blue" : "bg-gray-300 dark:bg-slate-700"}`}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex items-start">
                  <input
                    required
                    id="terms"
                    type="checkbox"
                    className="mt-1 h-4 w-4 rounded text-brand-blue border-gray-300 dark:border-slate-700 bg-white dark:bg-[#0f172a]"
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
                      className="font-semibold underline text-brand-blue"
                    >
                      Terms
                    </a>
                  </label>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    disabled={loading}
                    className="flex-1 font-semibold py-2 px-4 rounded border transition bg-white dark:bg-transparent border-gray-300 dark:border-slate-700 text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-slate-800 disabled:opacity-50"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 font-bold py-2 px-4 rounded transition bg-brand-blue text-white hover:bg-blue-600 disabled:opacity-50"
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
