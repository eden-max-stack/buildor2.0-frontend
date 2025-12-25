import Layout from "@/components/Layout";
import { User } from "lucide-react";

export default function Profile() {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center py-20">
          <User className="w-16 h-16 text-brand-dark mx-auto mb-6 opacity-50" />
          <h1 className="text-4xl font-bold text-brand-dark mb-4">
            Profile Settings
          </h1>
          <p className="text-gray-600 text-lg mb-8">
            Manage your personal information and preferences.
          </p>
          <div className="bg-gray-50 border border-gray-300 rounded-lg p-8 max-w-md mx-auto">
            <p className="text-gray-700 mb-4">
              Profile page will include:
            </p>
            <ul className="text-left space-y-2 text-gray-600 mb-6">
              <li>✓ Personal information (name, email)</li>
              <li>✓ University and degree details</li>
              <li>✓ Department and specialization</li>
              <li>✓ Year of study</li>
              <li>✓ Skills and expertise areas</li>
              <li>✓ GitHub profile link</li>
              <li>✓ Skill level and progress tracking</li>
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
