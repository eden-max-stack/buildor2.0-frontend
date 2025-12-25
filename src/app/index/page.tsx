import Link from "next/link";
import Layout from "@/components/Layout";
import { ArrowRight, Trophy, Code2, Users, Zap } from "lucide-react";

export default function Index() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-brand-dark mb-6 leading-tight">
                Master DSA Through
                <span className="block bg-gradient-to-r from-brand-blue to-brand-red bg-clip-text text-transparent">
                  Competition
                </span>
              </h1>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Join thousands of students solving data structures and algorithms problems. Compete on the leaderboard, collaborate with peers, and track your progress.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/leaderboard"
                  className="inline-flex items-center justify-center gap-2 bg-brand-blue text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
                >
                  View Leaderboard <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/questions"
                  className="inline-flex items-center justify-center gap-2 bg-brand-amber text-brand-dark px-8 py-3 rounded-lg font-semibold hover:bg-amber-400 transition-colors"
                >
                  Start Solving <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Hero Illustration */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-brand-blue/20 to-brand-amber/20 rounded-2xl blur-3xl"></div>
              <div className="relative bg-gradient-to-br from-brand-blue to-blue-600 rounded-2xl p-8 text-white">
                <div className="space-y-6">
                  {/* Stats Row */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white/15 backdrop-blur rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold">25+</p>
                      <p className="text-xs text-white/80">Problems</p>
                    </div>
                    <div className="bg-white/15 backdrop-blur rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold">7</p>
                      <p className="text-xs text-white/80">Categories</p>
                    </div>
                    <div className="bg-white/15 backdrop-blur rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold">∞</p>
                      <p className="text-xs text-white/80">Challenges</p>
                    </div>
                  </div>

                  {/* Feature Pills */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 bg-white/10 rounded-lg px-4 py-2 text-sm">
                      <span className="text-lg">🎯</span>
                      <span>Real-time Code Execution</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/10 rounded-lg px-4 py-2 text-sm">
                      <span className="text-lg">🏆</span>
                      <span>Live Leaderboard Rankings</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/10 rounded-lg px-4 py-2 text-sm">
                      <span className="text-lg">💡</span>
                      <span>Smart Hint System</span>
                    </div>
                  </div>

                  {/* Bottom Accent */}
                  <div className="flex gap-2 mt-4">
                    <div className="flex-1 h-1 bg-brand-amber/40 rounded"></div>
                    <div className="flex-1 h-1 bg-brand-red/40 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-4">
              Everything You Need
            </h2>
            <p className="text-gray-600 text-lg">
              A complete platform to learn, practice, and master DSA
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="p-6 bg-gradient-to-br from-blue-50 to-white rounded-xl border border-brand-blue/20 hover:border-brand-blue/50 transition-colors">
              <Trophy className="w-12 h-12 text-brand-blue mb-4" />
              <h3 className="text-xl font-bold text-brand-dark mb-2">
                Leaderboard
              </h3>
              <p className="text-gray-600">
                Compete with peers and track your ranking based on problems solved and skill level.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 bg-gradient-to-br from-amber-50 to-white rounded-xl border border-brand-amber/20 hover:border-brand-amber/50 transition-colors">
              <Code2 className="w-12 h-12 text-brand-amber mb-4" />
              <h3 className="text-xl font-bold text-brand-dark mb-2">
                Problem Bank
              </h3>
              <p className="text-gray-600">
                Access 500+ DSA problems with tags for arrays, trees, graphs, DP, and more.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 bg-gradient-to-br from-red-50 to-white rounded-xl border border-brand-red/20 hover:border-brand-red/50 transition-colors">
              <Zap className="w-12 h-12 text-brand-red mb-4" />
              <h3 className="text-xl font-bold text-brand-dark mb-2">
                Code Sandbox
              </h3>
              <p className="text-gray-600">
                Write and test your code instantly with integrated IDE and real-time output.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 bg-gradient-to-br from-emerald-50 to-white rounded-xl border border-emerald-200 hover:border-emerald-400 transition-colors">
              <Users className="w-12 h-12 text-emerald-600 mb-4" />
              <h3 className="text-xl font-bold text-brand-dark mb-2">
                Collaboration
              </h3>
              <p className="text-gray-600">
                View peer profiles, skills, projects, and connect with students and professors.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-brand-dark to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl md:text-5xl font-bold mb-2">5000+</p>
              <p className="text-gray-300">Active Students</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-bold mb-2">500+</p>
              <p className="text-gray-300">DSA Problems</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-bold mb-2">7</p>
              <p className="text-gray-300">Problem Categories</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-bold mb-2">50+</p>
              <p className="text-gray-300">Universities</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-6">
            Ready to Start Your DSA Journey?
          </h2>
          <p className="text-gray-600 text-lg mb-8">
            Join the community and begin solving problems today. Track your progress and climb the leaderboard.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/questions"
              className="inline-flex items-center justify-center gap-2 bg-brand-blue text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
            >
              Explore Problems <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/leaderboard"
              className="inline-flex items-center justify-center gap-2 border-2 border-brand-blue text-brand-blue px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              View Rankings
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
