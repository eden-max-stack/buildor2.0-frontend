'use client';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      
      <h1 className="text-3xl font-bold text-black mb-8">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-black">

        {/* Card 1 */}
        <div className="bg-white shadow rounded p-6">
          <h2 className="text-xl font-semibold mb-4">Active Users</h2>
          <p className="text-4xl font-bold">1,234</p>
        </div>

        {/* Card 2 */}
        <div className="bg-white shadow rounded p-6">
          <h2 className="text-xl font-semibold mb-4">New Recommendations</h2>
          <p className="text-4xl font-bold">567</p>
        </div>

        {/* Card 3 */}
        <div className="bg-white shadow rounded p-6">
          <h2 className="text-xl font-semibold mb-4">System Health</h2>
          <p className="text-4xl font-bold text-green-500">Good ✅</p>
        </div>

      </div>

      <div className="mt-12 text-black bg-white shadow rounded p-6">
        <h2 className="text-2xl font-semibold mb-4">Recent Activity</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>User John Doe added a new recommendation.</li>
          <li>System backup completed successfully.</li>
          <li>New user registration: Jane Smith.</li>
        </ul>
      </div>
      
    </div>
  );
}
