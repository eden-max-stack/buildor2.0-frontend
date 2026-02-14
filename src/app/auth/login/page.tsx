'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
// Using Lucide icons for the toggle, or you can use your custom SVGs
import { Sun, Moon } from 'lucide-react';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [darkMode, setDarkMode] = useState(true); // Defaulting to dark as per your first style
  const router = useRouter();

  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <div className={`${darkMode ? 'dark' : ''}`}>
      <div className="min-h-screen flex flex-col items-center justify-center p-4 transition-colors duration-300 bg-gray-100 dark:bg-[#0B1120]">
        
        {/* Dark Mode Toggle Positioned Top Right */}
        <div className="absolute top-4 right-4">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
            title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? (
              <Sun className="w-6 h-6 text-yellow-500" />
            ) : (
              <Moon className="w-6 h-6 text-blue-600" />
            )}
          </button>
        </div>

        <div className="w-full max-w-md p-8 shadow-xl rounded-lg border transition-all bg-white dark:bg-[#1e293b] border-gray-200 dark:border-slate-800">
          
          {/* Header Section */}
          <div className="flex flex-col items-center mb-8">
            <img 
              src={darkMode ? "/buildor_logo_dark.svg" : "/buildor_logo_light.svg"} 
              alt="Logo" 
              className="h-16 w-auto mb-4" 
            />
            <h1 className="text-3xl font-bold text-black dark:text-white">Welcome back!</h1>
            <p className="text-gray-500 dark:text-slate-400 mt-2">Please sign in to your account</p>
          </div>

          {/* Form Section */}
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            
            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium mb-1 text-gray-700 dark:text-slate-300">
                Username
              </label>
              <input
                type="text"
                id="username"
                className="w-full rounded px-3 py-2 border transition-colors outline-none focus:ring-2 focus:ring-yellow-500 
                           bg-white dark:bg-[#0f172a] 
                           border-gray-300 dark:border-slate-700 
                           text-black dark:text-white 
                           placeholder-gray-400 dark:placeholder-slate-500"
                placeholder="Enter your username"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1 text-gray-700 dark:text-slate-300">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className="w-full rounded px-3 py-2 border transition-colors outline-none focus:ring-2 focus:ring-yellow-500 pr-10
                             bg-white dark:bg-[#0f172a] 
                             border-gray-300 dark:border-slate-700 
                             text-black dark:text-white 
                             placeholder-gray-400 dark:placeholder-slate-500"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 dark:text-slate-400 hover:text-gray-600 dark:hover:text-slate-200"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full font-bold py-2 px-4 rounded transition duration-200 
                         bg-black dark:bg-yellow-500 
                         text-white dark:text-black 
                         hover:bg-gray-800 dark:hover:bg-yellow-400"
              onClick={() => router.push('/')}
            >
              Sign In
            </button>
          </form>

          {/* Divider */}
        <div className="relative my-6 flex items-center">
        {/* Left Line */}
        <div className="flex-grow border-t border-gray-300 dark:border-slate-700"></div>
        
        {/* Text */}
        <span className="flex-shrink mx-4 text-sm text-gray-500 dark:text-slate-400">
            Or continue with
        </span>
        
        {/* Right Line */}
        <div className="flex-grow border-t border-gray-300 dark:border-slate-700"></div>
        </div>

          {/* OAuth Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center px-4 py-2 border rounded shadow-sm text-sm font-medium transition-colors
                               bg-white dark:bg-[#0f172a] 
                               border-gray-300 dark:border-slate-700 
                               text-gray-700 dark:text-slate-300 
                               hover:bg-gray-50 dark:hover:bg-slate-800">
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google
            </button>
            <button className="flex items-center justify-center px-4 py-2 border rounded shadow-sm text-sm font-medium transition-colors
                               bg-white dark:bg-[#0f172a] 
                               border-gray-300 dark:border-slate-700 
                               text-gray-700 dark:text-slate-300 
                               hover:bg-gray-50 dark:hover:bg-slate-800">
               <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                 <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
               </svg>
              GitHub
            </button>
          </div>

          <div className="mt-6 text-center text-sm">
            <span className="text-gray-500 dark:text-slate-400">Don't have an account? </span>
            <Link href="/register" className="font-semibold text-black dark:text-yellow-500 hover:underline">
              Register here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}