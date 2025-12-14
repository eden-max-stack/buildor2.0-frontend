import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="bg-white px-6 py-4 shadow-md">
      
      <div className="navbar-items" style={{ display: 'flex', justifyContent: 'space-between'}}>
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

        <div className="navbar-links" style={{ display: 'flex', gap: '20px', flex: 2, justifyContent: 'flex-end', alignItems: 'center', color: '#1f2022' }}>
          <Link href="/leaderboard">Leaderboard</Link>
          <Link href="/coding-practice">Questions</Link>
          <Link href="/professor-portal">Professor Portal</Link>
        </div>
      </div>
      
    </nav>
  );
}
