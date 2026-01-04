import Link from "next/link";
import Layout from "@/components/Layout";
import { Trophy, Code2, Users, Zap, Braces, ChevronRight } from "lucide-react";

export default function Index() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50 to-white dark:from-gray-900 dark:via-blue-900/20 dark:to-gray-900 transition-colors">
        {/* Subtle Code Background Pattern */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-0 text-8xl font-mono text-brand-blue/20">{"{ }"}</div>
          <div className="absolute top-20 right-10 text-6xl font-mono text-brand-amber/20">{"=>"}</div>
          <div className="absolute bottom-20 left-20 text-7xl font-mono text-brand-blue/15">{"</>"}</div>
          <div className="absolute bottom-40 right-0 text-9xl font-mono text-brand-dark/10">{"( )"}</div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block mb-4 px-3 py-1 bg-brand-blue/10 border border-brand-blue/30 rounded-full">
                <p className="text-xs font-mono text-brand-blue uppercase tracking-widest">Advanced DSA Platform</p>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-brand-dark dark:text-white mb-6 leading-tight">
                Master DSA Through
                <span className="block bg-gradient-to-r from-brand-blue to-brand-red dark:from-brand-amber dark:to-brand-red bg-clip-text text-transparent">
                  Competition
                </span>
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                Join thousands of students solving data structures and algorithms problems. Compete on the leaderboard, collaborate with peers, and track your progress.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/leaderboard"
                  className="inline-flex items-center justify-center gap-2 bg-brand-blue text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-all hover:shadow-lg active:scale-95"
                >
                  View Leaderboard <ChevronRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/questions"
                  className="inline-flex items-center justify-center gap-2 bg-brand-amber text-brand-dark px-8 py-3 rounded-lg font-semibold hover:bg-amber-400 transition-all hover:shadow-lg active:scale-95"
                >
                  Start Solving <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Hero Illustration - Code Editor Style */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-brand-blue/20 to-brand-amber/20 rounded-2xl blur-3xl"></div>
              <div className="relative bg-gradient-to-br from-brand-dark dark:from-gray-900 to-blue-900 dark:to-gray-800 rounded-xl border border-gray-700/50 dark:border-gray-700 p-6 text-white shadow-2xl overflow-hidden">
                {/* Editor Header */}
                <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-700">
                  <div className="w-3 h-3 rounded-full bg-brand-red"></div>
                  <div className="w-3 h-3 rounded-full bg-brand-amber"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  <span className="text-xs text-gray-400 ml-auto font-mono">platform.ts</span>
                </div>

                <div className="space-y-5">
                  {/* Code-like Content */}
                  <div className="font-mono text-sm space-y-3">
                    <div className="text-gray-400">
                      <span className="text-brand-amber">const</span> <span className="text-blue-300">platform</span> <span className="text-brand-amber">=</span> <span className="text-green-400">{"{}"}</span>
                    </div>
                    <div className="text-gray-400 pl-4">
                      <span className="text-blue-300">problems</span><span className="text-brand-amber">:</span> <span className="text-orange-300">25</span><span className="text-brand-amber">,</span>
                    </div>
                    <div className="text-gray-400 pl-4">
                      <span className="text-blue-300">categories</span><span className="text-brand-amber">:</span> <span className="text-orange-300">7</span><span className="text-brand-amber">,</span>
                    </div>
                    <div className="text-gray-400 pl-4">
                      <span className="text-blue-300">challenges</span><span className="text-brand-amber">:</span> <span className="text-orange-300">∞</span>
                    </div>
                    <div className="text-gray-400">
                      <span className="text-brand-amber">{"}"}</span>
                    </div>
                  </div>

                  {/* Features with Code Accent */}
                  <div className="pt-4 border-t border-gray-700 space-y-2">
                    <div className="flex items-center gap-3 text-sm">
                      <Braces className="w-4 h-4 text-brand-amber flex-shrink-0" />
                      <span className="text-gray-300">Real-time Code Execution</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Braces className="w-4 h-4 text-brand-red flex-shrink-0" />
                      <span className="text-gray-300">Live Rankings</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Braces className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span className="text-gray-300">Smart Hints</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-white dark:from-gray-950 to-blue-50/30 dark:to-gray-900/50 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-dark dark:text-white mb-4">
              Everything You Need
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              A complete platform to learn, practice, and master DSA
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 - Leaderboard */}
            <div className="group p-6 bg-white dark:bg-gray-800 rounded-xl border border-brand-blue/20 dark:border-brand-blue/30 hover:border-brand-blue/50 dark:hover:border-brand-blue/50 transition-all hover:shadow-lg hover:scale-105">
              <div className="mb-4 inline-block p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 transition-colors">
                <Trophy className="w-6 h-6 text-brand-blue" />
              </div>
              <h3 className="text-lg font-bold text-brand-dark dark:text-white mb-2">
                Leaderboard
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                Compete with peers and track your ranking based on problems solved and skill level.
              </p>
              <p className="text-xs font-mono text-brand-blue dark:text-brand-amber">rank(user)</p>
            </div>

            {/* Feature 2 - Problem Bank */}
            <div className="group p-6 bg-white dark:bg-gray-800 rounded-xl border border-brand-amber/20 dark:border-brand-amber/30 hover:border-brand-amber/50 dark:hover:border-brand-amber/50 transition-all hover:shadow-lg hover:scale-105">
              <div className="mb-4 inline-block p-3 bg-amber-50 dark:bg-amber-900/30 rounded-lg group-hover:bg-amber-100 dark:group-hover:bg-amber-900/50 transition-colors">
                <Code2 className="w-6 h-6 text-brand-amber" />
              </div>
              <h3 className="text-lg font-bold text-brand-dark dark:text-white mb-2">
                Problem Bank
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                Access 500+ DSA problems with tags for arrays, trees, graphs, DP, and more.
              </p>
              <p className="text-xs font-mono text-brand-amber dark:text-brand-amber">fetch(problems)</p>
            </div>

            {/* Feature 3 - Code Sandbox */}
            <div className="group p-6 bg-white dark:bg-gray-800 rounded-xl border border-brand-red/20 dark:border-brand-red/30 hover:border-brand-red/50 dark:hover:border-brand-red/50 transition-all hover:shadow-lg hover:scale-105">
              <div className="mb-4 inline-block p-3 bg-red-50 dark:bg-red-900/30 rounded-lg group-hover:bg-red-100 dark:group-hover:bg-red-900/50 transition-colors">
                <Zap className="w-6 h-6 text-brand-red" />
              </div>
              <h3 className="text-lg font-bold text-brand-dark dark:text-white mb-2">
                Code Sandbox
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                Write and test your code instantly with integrated IDE and real-time output.
              </p>
              <p className="text-xs font-mono text-brand-red dark:text-brand-red">execute(code)</p>
            </div>

            {/* Feature 4 - Collaboration */}
            <div className="group p-6 bg-white dark:bg-gray-800 rounded-xl border border-emerald-200 dark:border-emerald-800 hover:border-emerald-400 dark:hover:border-emerald-600 transition-all hover:shadow-lg hover:scale-105">
              <div className="mb-4 inline-block p-3 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/50 transition-colors">
                <Users className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-lg font-bold text-brand-dark dark:text-white mb-2">
                Collaboration
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                View peer profiles, skills, projects, and connect with students and professors.
              </p>
              <p className="text-xs font-mono text-emerald-600 dark:text-emerald-400">connect(peers)</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - Terminal Style */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-brand-dark dark:from-gray-900 via-blue-900 dark:via-gray-800 to-brand-dark dark:to-gray-900 text-white relative overflow-hidden transition-colors">
        {/* Code Background */}
        <div className="absolute inset-0 opacity-5 pointer-events-none font-mono text-xs overflow-hidden">
          <div className="whitespace-pre">
            {`console.log("Builder");
for (let i = 0; i < 5000; i++) {
  users.push(student);
}
const problems = 500;
const categories = 7;`}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Stat 1 */}
            <div className="p-6 border-l-4 border-brand-red bg-white/5 dark:bg-white/5 rounded-lg backdrop-blur-sm hover:bg-white/10 dark:hover:bg-white/10 transition-colors">
              <p className="text-4xl md:text-5xl font-bold text-brand-amber dark:text-brand-amber mb-2 font-mono">5000+</p>
              <p className="text-gray-300 dark:text-gray-400 text-sm">Active Students</p>
              <p className="text-xs text-gray-500 dark:text-gray-600 mt-2 font-mono">students.length</p>
            </div>

            {/* Stat 2 */}
            <div className="p-6 border-l-4 border-brand-amber bg-white/5 dark:bg-white/5 rounded-lg backdrop-blur-sm hover:bg-white/10 dark:hover:bg-white/10 transition-colors">
              <p className="text-4xl md:text-5xl font-bold text-brand-red dark:text-brand-red mb-2 font-mono">500+</p>
              <p className="text-gray-300 dark:text-gray-400 text-sm">DSA Problems</p>
              <p className="text-xs text-gray-500 dark:text-gray-600 mt-2 font-mono">problems.count()</p>
            </div>

            {/* Stat 3 */}
            <div className="p-6 border-l-4 border-emerald-400 dark:border-emerald-500 bg-white/5 dark:bg-white/5 rounded-lg backdrop-blur-sm hover:bg-white/10 dark:hover:bg-white/10 transition-colors">
              <p className="text-4xl md:text-5xl font-bold text-emerald-400 dark:text-emerald-400 mb-2 font-mono">7</p>
              <p className="text-gray-300 dark:text-gray-400 text-sm">Problem Categories</p>
              <p className="text-xs text-gray-500 dark:text-gray-600 mt-2 font-mono">categories</p>
            </div>

            {/* Stat 4 */}
            <div className="p-6 border-l-4 border-blue-400 dark:border-blue-500 bg-white/5 dark:bg-white/5 rounded-lg backdrop-blur-sm hover:bg-white/10 dark:hover:bg-white/10 transition-colors">
              <p className="text-4xl md:text-5xl font-bold text-blue-300 dark:text-blue-300 mb-2 font-mono">50+</p>
              <p className="text-gray-300 dark:text-gray-400 text-sm">Universities</p>
              <p className="text-xs text-gray-500 dark:text-gray-600 mt-2 font-mono">orgs.total()</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-brand-dark dark:from-gray-900 to-blue-900 dark:to-gray-800 relative overflow-hidden transition-colors">
        {/* Code Accent Borders */}
        <div className="absolute top-0 left-0 w-32 h-32 text-8xl font-mono text-brand-amber/20 dark:text-brand-amber/10 opacity-40">{"{"}</div>
        <div className="absolute bottom-0 right-0 w-32 h-32 text-8xl font-mono text-brand-red/20 dark:text-brand-red/10 opacity-40">{"}"}</div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white dark:text-white mb-6">
            Ready to Start Your DSA Journey?
          </h2>
          <p className="text-gray-300 dark:text-gray-400 text-lg mb-8">
            Join the community and begin solving problems today. Track your progress and climb the leaderboard.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/questions"
              className="inline-flex items-center justify-center gap-2 bg-brand-blue text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-all hover:shadow-lg active:scale-95"
            >
              Explore Problems <ChevronRight className="w-4 h-4" />
            </Link>
            <Link
              href="/leaderboard"
              className="inline-flex items-center justify-center gap-2 border-2 border-brand-amber text-brand-amber px-8 py-3 rounded-lg font-semibold hover:bg-brand-amber/10 transition-all hover:shadow-lg active:scale-95"
            >
              View Rankings <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
