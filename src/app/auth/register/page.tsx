'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sun, Moon, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Register() {
  const [step, setStep] = useState(1);
  const [darkMode, setDarkMode] = useState(true);
  const router = useRouter();
  
  // State for form fields
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    password: '',
    confirmPassword: '',
    acceptedTerms: false,
    username: '',
    avatar: 'avatar1' 
  });

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const handleNextStep = (e) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else {
      console.log("Registration Complete", formData);
      router.push('/');
    }
  };

  const avatars = ['😊', '🚀', '🐱', '🤖'];
  const currentAvatarIndex = parseInt(formData.avatar.replace('avatar', '')) - 1;

  return (
    <div className={`${darkMode ? 'dark' : ''}`}>
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
                <img 
                  src={darkMode ? "/buildor_logo_dark.svg" : "/buildor_logo_light.svg"} 
                  alt="Logo" 
                  className="h-16 w-auto mb-4" 
                />
                <h1 className="text-3xl font-bold text-center text-black dark:text-white">Welcome!</h1>
                <p className="text-gray-500 dark:text-slate-400 mt-2">Create your account to get started</p>
              </div>

              <form onSubmit={handleNextStep} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-slate-300">Full Name</label>
                  <input
                    required
                    type="text"
                    className="w-full rounded px-3 py-2 border outline-none focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-[#0f172a] border-gray-300 dark:border-slate-700 text-black dark:text-white"
                    placeholder="John Doe"
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-slate-300">Password</label>
                  <div className="relative">
                    <input
                      required
                      type={showPassword ? "text" : "password"}
                      className="w-full rounded px-3 py-2 border outline-none focus:ring-2 focus:ring-yellow-500 pr-10 bg-white dark:bg-[#0f172a] border-gray-300 dark:border-slate-700 text-black dark:text-white"
                      placeholder="Create a password"
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 dark:text-slate-400"
                    >
                      {showPassword ? <Sun size={20} /> : <Moon size={20} />} {/* Reusing logic from your SVG icons */}
                    </button>
                  </div>
                </div>

                <div className="flex items-start">
                  <input
                    required
                    id="terms"
                    type="checkbox"
                    className="mt-1 h-4 w-4 rounded text-yellow-500 border-gray-300 dark:border-slate-700 bg-white dark:bg-[#0f172a]"
                    onChange={(e) => setFormData({...formData, acceptedTerms: e.target.checked})}
                  />
                  <label htmlFor="terms" className="ml-2 block text-sm text-gray-700 dark:text-slate-300">
                    I accept the <a href="#" className="font-semibold underline text-black dark:text-yellow-500">Terms</a>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full font-bold py-2 px-4 rounded transition bg-black dark:bg-yellow-500 text-white dark:text-black hover:opacity-90"
                >
                  Continue
                </button>

                <div className="mt-4 text-center text-sm">
                  <span className="text-gray-500 dark:text-slate-400">Already have an account? </span>
                  <Link href="/login" className="font-semibold text-black dark:text-yellow-500 hover:underline">
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
                <h1 className="text-2xl font-bold text-center text-black dark:text-white">Setup Profile</h1>
                <p className="text-gray-500 dark:text-slate-400 mt-2">Let's personalize your profile.</p>
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
                        const prevIndex = (currentAvatarIndex - 1 + avatars.length) % avatars.length;
                        setFormData({ ...formData, avatar: `avatar${prevIndex + 1}` });
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
                        const nextIndex = (currentAvatarIndex + 1) % avatars.length;
                        setFormData({ ...formData, avatar: `avatar${nextIndex + 1}` });
                      }}
                      className="p-3 rounded-full border transition-all bg-white dark:bg-[#0f172a] border-gray-200 dark:border-slate-700 hover:scale-110"
                    >
                      <ChevronRight className="text-gray-600 dark:text-slate-300" />
                    </button>
                  </div>
                  
                  <div className="flex justify-center gap-2 mt-4">
                    {avatars.map((_, idx) => (
                      <div key={idx} className={`h-2 w-2 rounded-full transition-colors ${currentAvatarIndex === idx ? 'bg-black dark:bg-yellow-500' : 'bg-gray-300 dark:bg-slate-700'}`} />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-slate-300">Username</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l border border-r-0 text-sm bg-gray-50 dark:bg-[#0f172a] border-gray-300 dark:border-slate-700 text-gray-500 dark:text-slate-400">
                      @
                    </span>
                    <input
                      required
                      type="text"
                      className="flex-1 rounded-r px-3 py-2 border outline-none focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-[#0f172a] border-gray-300 dark:border-slate-700 text-black dark:text-white"
                      placeholder="username"
                      onChange={(e) => setFormData({...formData, username: e.target.value})}
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 font-semibold py-2 px-4 rounded border transition bg-white dark:bg-transparent border-gray-300 dark:border-slate-700 text-black dark:text-white hover:bg-gray-50 dark:hover:bg-slate-800"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 font-bold py-2 px-4 rounded transition bg-black dark:bg-yellow-500 text-white dark:text-black hover:opacity-90"
                  >
                    Finish!
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