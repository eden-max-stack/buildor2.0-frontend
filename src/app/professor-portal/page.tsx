import Layout from "@/components/Layout";
import { Users } from "lucide-react";

export default function ProfessorDashboard() {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center py-20">
          <Users className="w-16 h-16 text-brand-red mx-auto mb-6 opacity-50" />
          <h1 className="text-4xl font-bold text-brand-dark mb-4">
            Professor Portal
          </h1>
          <p className="text-gray-600 text-lg mb-8">
            Manage questions and track student performance.
          </p>
          <div className="bg-red-50 border border-brand-red/20 rounded-lg p-8 max-w-md mx-auto">
            <p className="text-gray-700 mb-4">
              Professor features include:
            </p>
            <ul className="text-left space-y-2 text-gray-600 mb-6">
              <li>✓ Add new DSA questions to database</li>
              <li>✓ Set constraints and test cases</li>
              <li>✓ View student submissions</li>
              <li>✓ Track student performance metrics</li>
              <li>✓ View completion rates</li>
              <li>✓ Export reports</li>
            </ul>
            <p className="text-sm text-gray-500">
              Start building this feature by prompting to continue development.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
