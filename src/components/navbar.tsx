import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-[#d9d9d9] px-6 py-4 shadow-md flex items-center justify-between">
      
      <Link href="/" className="text-xl font-bold text-gray-800">
        Buildor
      </Link>
      
      <div className="flex gap-6">
        
      </div>
      
    </nav>
  );
}
