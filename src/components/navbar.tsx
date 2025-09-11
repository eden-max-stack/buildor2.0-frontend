import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-[#d9d9d9] px-6 py-4 shadow-md flex items-center justify-between">
      
      <Link href="/" className="text-xl font-bold text-gray-800">
        Buildor
      </Link>
      
      <div className="flex gap-6">
        <Link href="/dashboard" className="hover:underline text-gray-700">
          Dashboard
        </Link>
        <Link href="/recommendation-engine" className="hover:underline text-gray-700">
          Recommendation Engine
        </Link>
        <Link href="/coding-practice-platform" className="hover:underline text-gray-700">
          Coding Practice
        </Link>
      </div>
      
    </nav>
  );
}
