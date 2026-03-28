"use client";

import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import {
  User,
  Lock,
  Bell,
  Github,
  Save,
  Trash2,
  AlertTriangle,
  Moon,
  Sun,
  Monitor,
  Loader2,
  CheckCircle,
  XCircle,
  MapPin,
  X,
  Briefcase,
  Award,
} from "lucide-react";
import {
  ThemeMode,
  ChangePasswordData,
  NotificationSettings,
  UserSettings,
  StudentProfileFormData,
  TrainerProfileFormData,
} from "./models";
import {
  fetchUserSettings,
  changePassword,
  deleteAccount,
  updateAppearance,
  updateNotifications,
  validatePassword,
} from "./settings-api";
import { createClient } from "@/lib/supabase/client";

type SettingsTab =
  | "Public Profile"
  | "Account"
  | "Appearance"
  | "Notifications";

export default function ProfileSettings() {
  const [role, setRole] = useState<"STUDENT" | "TRAINER">("STUDENT");
  const [activeTab, setActiveTab] = useState<SettingsTab>("Public Profile");
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  // Fetch settings on mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);

    try {
      // 1. Get secure session token & Extract Role (Mirroring the Profile page)
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (!sessionError && session) {
        const userRole = session.user.user_metadata?.role || "STUDENT";
        setRole(userRole);
      }

      // 2. Fetch all user settings
      const response = await fetchUserSettings();

      if (response.success && response.data) {
        setSettings(response.data);
      } else {
        console.error("Failed to load settings:", response.error);
      }
    } catch (err) {
      console.error("Error loading profile settings:", err);
    } finally {
      setLoading(false);
    }
  };

  // Helper to render the active form content
  const renderContent = () => {
    if (loading || !settings) {
      return (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      );
    }

    switch (activeTab) {
      case "Account":
        return <AccountSettings accountData={settings.account} />;
      case "Appearance":
        return <AppearanceSettings appearanceData={settings.appearance} />;
      case "Notifications":
        return (
          <NotificationSettingsForm notificationData={settings.notifications} />
        );
      default:
        // --- DYNAMIC RENDERING BASED ON SUPABASE ROLE ---
        if (role === "TRAINER") {
          return (
            <TrainerProfileSettingsForm
              // Cast to any to bypass strict UserSettings typings if needed
              profileData={settings.publicProfile as any}
            />
          );
        } else {
          return (
            <StudentProfileSettingsForm
              profileData={settings.publicProfile as any}
            />
          );
        }
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8 border-b border-gray-200 dark:border-gray-800 pb-4">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Settings
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Manage your profile settings and account preferences.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* --- LEFT SIDEBAR (Navigation) --- */}
            <div className="md:col-span-3">
              <nav className="space-y-1">
                <NavButton
                  active={activeTab === "Public Profile"}
                  onClick={() => setActiveTab("Public Profile")}
                  icon={<User className="w-4 h-4" />}
                  // Dynamically change the label based on role
                  label={
                    role === "TRAINER" ? "Trainer Profile" : "Student Profile"
                  }
                />
                <NavButton
                  active={activeTab === "Account"}
                  onClick={() => setActiveTab("Account")}
                  icon={<Lock className="w-4 h-4" />}
                  label="Account Security"
                />
                <NavButton
                  active={activeTab === "Appearance"}
                  onClick={() => setActiveTab("Appearance")}
                  icon={<Monitor className="w-4 h-4" />}
                  label="Appearance"
                />
                <NavButton
                  active={activeTab === "Notifications"}
                  onClick={() => setActiveTab("Notifications")}
                  icon={<Bell className="w-4 h-4" />}
                  label="Notifications"
                />
              </nav>
            </div>

            {/* --- RIGHT CONTENT AREA (Forms) --- */}
            <div className="md:col-span-9 space-y-6">{renderContent()}</div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

// --- SUB-COMPONENTS ---

// 1. Navigation Button Component
function NavButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors
        ${
          active
            ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 border-l-4 border-blue-600 dark:border-blue-500"
            : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
        }
      `}
    >
      {icon}
      {label}
    </button>
  );
}

// 2. Status Message Component
function StatusMessage({
  type,
  message,
}: {
  type: "success" | "error";
  message: string;
}) {
  return (
    <div
      className={`flex items-center gap-2 p-3 rounded-md text-sm ${
        type === "success"
          ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800"
          : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800"
      }`}
    >
      {type === "success" ? (
        <CheckCircle className="w-4 h-4" />
      ) : (
        <XCircle className="w-4 h-4" />
      )}
      {message}
    </div>
  );
}

// 3. Trainer Profile Form
interface TrainerProfileSettingsFormProps {
  profileData?: TrainerProfileFormData;
}

function TrainerProfileSettingsForm({
  profileData,
}: TrainerProfileSettingsFormProps) {
  const supabase = createClient();

  const [formData, setFormData] = useState<TrainerProfileFormData>({
    title: profileData?.title || "",
    workplace: profileData?.workplace || "",
  });

  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatus(null);

    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session) {
        throw new Error("You must be logged in to save settings.");
      }

      // Pointing to your FastAPI route
      const response = await fetch(
        "http://localhost:8000/api/profile/trainer",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify(formData),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to update profile");
      }

      setStatus({
        type: "success",
        message: "Trainer profile updated successfully!",
      });
    } catch (err: any) {
      setStatus({ type: "error", message: err.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 animate-in fade-in duration-300"
    >
      <div>
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">
          Professional Identity
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Update your current title and where you work.
        </p>
      </div>
      <hr className="border-gray-200 dark:border-gray-700" />

      {status && <StatusMessage type={status.type} message={status.message} />}

      <div className="grid grid-cols-1 gap-6 max-w-2xl">
        {/* Title Field */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Professional Title
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-500 sm:text-sm">
              <Award className="w-4 h-4" />
            </span>
            <input
              id="title"
              name="title"
              type="text"
              required
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g. Senior Machine Learning Engineer"
              className="flex-1 block w-full rounded-none rounded-r-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
            />
          </div>
        </div>

        {/* Workplace Field */}
        <div>
          <label
            htmlFor="workplace"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Current Workplace
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-500 sm:text-sm">
              <Briefcase className="w-4 h-4" />
            </span>
            <input
              id="workplace"
              name="workplace"
              type="text"
              required
              value={formData.workplace}
              onChange={handleInputChange}
              placeholder="e.g. OpenAI, Freelance, Google"
              className="flex-1 block w-full rounded-none rounded-r-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
            />
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white text-sm font-medium rounded-md shadow-sm transition-colors"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Profile
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}

// 4. Student Profile Form
interface StudentProfileSettingsFormProps {
  profileData?: StudentProfileFormData;
}

function StudentProfileSettingsForm({
  profileData,
}: StudentProfileSettingsFormProps) {
  const supabase = createClient();

  const [formData, setFormData] = useState<StudentProfileFormData>({
    university: profileData?.university || "",
    degree: profileData?.degree || "",
    expected_grad_year: profileData?.expected_grad_year || "",
    gpa: profileData?.gpa || "",
    bio: profileData?.bio || "",
    portfolio_md: profileData?.portfolio_md || "",
    github_url: profileData?.github_url || "",
    location: profileData?.location || "",
    skills: profileData?.skills || [],
  });

  const [skillInput, setSkillInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "number" ? (value === "" ? "" : Number(value)) : value,
    });
  };

  const handleAddSkill = (e?: React.MouseEvent | React.KeyboardEvent) => {
    if (e) e.preventDefault();
    const newSkill = skillInput.trim();
    if (newSkill && !formData.skills.includes(newSkill)) {
      setFormData({
        ...formData,
        skills: [...formData.skills, newSkill],
      });
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((skill) => skill !== skillToRemove),
    });
  };

  const handleSkillKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill(e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatus(null);

    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session) {
        throw new Error("You must be logged in to save settings.");
      }

      const response = await fetch(
        "http://localhost:8000/api/profile/student",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify(formData),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to update profile");
      }

      setStatus({
        type: "success",
        message: "Student profile updated successfully!",
      });
    } catch (err: any) {
      setStatus({ type: "error", message: err.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 animate-in fade-in duration-300"
    >
      <div>
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">
          Student Profile
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Update your academic and portfolio details.
        </p>
      </div>
      <hr className="border-gray-200 dark:border-gray-700" />

      {status && <StatusMessage type={status.type} message={status.message} />}

      <div className="grid grid-cols-1 gap-6 max-w-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="university"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              University
            </label>
            <input
              id="university"
              name="university"
              type="text"
              value={formData.university}
              onChange={handleInputChange}
              placeholder="SRM Institute of Science and Technology"
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white px-3 py-2 border focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="degree"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Degree / Major
            </label>
            <input
              id="degree"
              name="degree"
              type="text"
              value={formData.degree}
              onChange={handleInputChange}
              placeholder="B.Tech Computer Science and Engineering"
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white px-3 py-2 border focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="expected_grad_year"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Expected Graduation Year
            </label>
            <input
              id="expected_grad_year"
              name="expected_grad_year"
              type="number"
              min="2000"
              max="2030"
              value={formData.expected_grad_year}
              onChange={handleInputChange}
              placeholder="2026"
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white px-3 py-2 border focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="gpa"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              GPA
            </label>
            <input
              id="gpa"
              name="gpa"
              type="number"
              step="0.01"
              min="0"
              max="10"
              value={formData.gpa}
              onChange={handleInputChange}
              placeholder="3.80"
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white px-3 py-2 border focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="location"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Location
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-500 sm:text-sm">
              <MapPin className="w-4 h-4" />
            </span>
            <input
              id="location"
              name="location"
              type="text"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="e.g. San Francisco, CA"
              className="flex-1 block w-full rounded-none rounded-r-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="skills"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Skills
          </label>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 mt-1">
            Add your top skills. Press Enter to add.
          </p>
          <div className="flex items-center gap-2 mb-3">
            <input
              id="skills"
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={handleSkillKeyDown}
              placeholder="e.g. React, Python, PostgreSQL..."
              className="flex-1 block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
            />
            <button
              type="button"
              onClick={handleAddSkill}
              className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:hover:bg-blue-800/50 dark:text-blue-400 text-sm font-medium rounded-md transition-colors border border-blue-200 dark:border-blue-800/50"
            >
              Add
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mt-2 min-h-[32px]">
            {formData.skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 transition-colors"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 focus:outline-none transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
            {formData.skills.length === 0 && (
              <span className="text-sm text-gray-400 dark:text-gray-500 italic py-1">
                No skills added yet.
              </span>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="github_url"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            GitHub URL
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-500 sm:text-sm">
              <Github className="w-4 h-4" />
            </span>
            <input
              id="github_url"
              name="github_url"
              type="url"
              value={formData.github_url}
              onChange={handleInputChange}
              placeholder="https://github.com/yourusername"
              className="flex-1 block w-full rounded-none rounded-r-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="bio"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            rows={3}
            value={formData.bio}
            onChange={handleInputChange}
            placeholder="Tell us about yourself in a short sentence or two"
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border font-mono"
          />
        </div>

        <div>
          <label
            htmlFor="portfolio_md"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Portfolio (Markdown supported)
          </label>
          <textarea
            id="portfolio_md"
            name="portfolio_md"
            rows={5}
            value={formData.portfolio_md}
            onChange={handleInputChange}
            placeholder="Tell us about the projects you've built..."
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border font-mono"
          />
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white text-sm font-medium rounded-md shadow-sm transition-colors"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Profile
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}

// 5. Account Settings Form
interface AccountSettingsProps {
  accountData: UserSettings["account"];
}

function AccountSettings({ accountData }: AccountSettingsProps) {
  const [passwordData, setPasswordData] = useState<ChangePasswordData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatus(null);

    // Client-side validation
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setStatus({ type: "error", message: "Passwords do not match" });
      setSaving(false);
      return;
    }

    const validation = validatePassword(passwordData.newPassword);
    if (!validation.valid) {
      setStatus({
        type: "error",
        message: validation.error || "Invalid password",
      });
      setSaving(false);
      return;
    }

    const response = await changePassword(passwordData);

    if (response.success) {
      setStatus({ type: "success", message: "Password updated successfully!" });
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } else {
      setStatus({
        type: "error",
        message: response.error || "Failed to update password",
      });
    }

    setSaving(false);
  };

  const handleDeleteAccount = async () => {
    if (!confirm("Are you absolutely sure? This action cannot be undone.")) {
      return;
    }

    const password = prompt("Please enter your password to confirm:");
    if (!password) return;

    const response = await deleteAccount(password);

    if (response.success) {
      alert("Account deleted successfully. Redirecting...");
      window.location.href = "/";
    } else {
      alert(response.error || "Failed to delete account");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">
          Account Security
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Manage your login credentials.
        </p>
      </div>
      <hr className="border-gray-200 dark:border-gray-700" />

      {/* Status Message */}
      {status && <StatusMessage type={status.type} message={status.message} />}

      {/* Account Info */}
      <div className="max-w-2xl space-y-4">
        <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Email</span>
              <p className="font-medium text-gray-900 dark:text-white">
                {accountData.email}
              </p>
            </div>
            <div>
              <span className="text-gray-500">Username</span>
              <p className="font-medium text-gray-900 dark:text-white">
                {accountData.username}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password */}
      <form onSubmit={handlePasswordChange} className="max-w-2xl space-y-4">
        <h3 className="text-md font-medium text-gray-900 dark:text-white">
          Change Password
        </h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Current Password
            </label>
            <input
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  currentPassword: e.target.value,
                })
              }
              required
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm px-3 py-2 border"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              New Password
            </label>
            <input
              type="password"
              value={passwordData.newPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  newPassword: e.target.value,
                })
              }
              required
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm px-3 py-2 border"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Confirm New Password
            </label>
            <input
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  confirmPassword: e.target.value,
                })
              }
              required
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm px-3 py-2 border"
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="mt-2 px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-sm font-medium rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            {saving ? "Updating..." : "Update Password"}
          </button>
        </div>
      </form>

      <hr className="border-gray-200 dark:border-gray-700" />

      {/* Danger Zone */}
      <div className="border border-red-200 dark:border-red-900/50 rounded-lg p-6 bg-red-50/50 dark:bg-red-900/10">
        <h3 className="text-red-600 dark:text-red-400 font-bold text-sm flex items-center gap-2 mb-2">
          <AlertTriangle className="w-4 h-4" /> Danger Zone
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          Once you delete your account, there is no going back. Please be
          certain.
        </p>
        <button
          onClick={handleDeleteAccount}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md shadow-sm transition-colors flex items-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Delete Account
        </button>
      </div>
    </div>
  );
}

// 6. Appearance Settings Form
interface AppearanceSettingsProps {
  appearanceData: UserSettings["appearance"];
}

function AppearanceSettings({ appearanceData }: AppearanceSettingsProps) {
  const [theme, setTheme] = useState<ThemeMode>(appearanceData.theme);
  const [, setSaving] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleThemeChange = async (newTheme: ThemeMode) => {
    setTheme(newTheme);
    setSaving(true);
    setStatus(null);

    const response = await updateAppearance({ theme: newTheme });

    if (response.success) {
      setStatus({ type: "success", message: "Theme updated successfully!" });
      // Apply theme to DOM
      if (newTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else if (newTheme === "light") {
        document.documentElement.classList.remove("dark");
      } else {
        // System preference
        const isDark = window.matchMedia(
          "(prefers-color-scheme: dark)",
        ).matches;
        document.documentElement.classList.toggle("dark", isDark);
      }
    } else {
      setStatus({
        type: "error",
        message: response.error || "Failed to update theme",
      });
    }

    setSaving(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">
          Appearance
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Customize how the application looks on your device.
        </p>
      </div>
      <hr className="border-gray-200 dark:border-gray-700" />

      {/* Status Message */}
      {status && <StatusMessage type={status.type} message={status.message} />}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Light Mode Card */}
        <div
          className="cursor-pointer group"
          onClick={() => handleThemeChange("light")}
        >
          <div
            className={`aspect-video rounded-lg border-2 ${theme === "light" ? "border-blue-500" : "border-gray-200 dark:border-gray-700"} bg-gray-100 flex items-center justify-center mb-2 group-hover:border-blue-500 transition-colors`}
          >
            <Sun className="w-8 h-8 text-gray-500" />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="radio"
              name="theme"
              id="light"
              checked={theme === "light"}
              onChange={() => handleThemeChange("light")}
              className="text-blue-600"
            />
            <label
              htmlFor="light"
              className="text-sm font-medium text-gray-900 dark:text-white cursor-pointer"
            >
              Light Mode
            </label>
          </div>
        </div>

        {/* Dark Mode Card */}
        <div
          className="cursor-pointer group"
          onClick={() => handleThemeChange("dark")}
        >
          <div
            className={`aspect-video rounded-lg border-2 ${theme === "dark" ? "border-blue-500" : "border-gray-200 dark:border-gray-700"} bg-gray-900 flex items-center justify-center mb-2 group-hover:border-blue-500 transition-colors`}
          >
            <Moon className="w-8 h-8 text-gray-400" />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="radio"
              name="theme"
              id="dark"
              checked={theme === "dark"}
              onChange={() => handleThemeChange("dark")}
              className="text-blue-600"
            />
            <label
              htmlFor="dark"
              className="text-sm font-medium text-gray-900 dark:text-white cursor-pointer"
            >
              Dark Mode
            </label>
          </div>
        </div>

        {/* System Mode Card */}
        <div
          className="cursor-pointer group"
          onClick={() => handleThemeChange("system")}
        >
          <div
            className={`aspect-video rounded-lg border-2 ${theme === "system" ? "border-blue-500" : "border-gray-200 dark:border-gray-700"} bg-gradient-to-r from-gray-100 to-gray-900 flex items-center justify-center mb-2 group-hover:border-blue-500 transition-colors`}
          >
            <Monitor className="w-8 h-8 text-gray-600 dark:text-gray-300" />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="radio"
              name="theme"
              id="system"
              checked={theme === "system"}
              onChange={() => handleThemeChange("system")}
              className="text-blue-600"
            />
            <label
              htmlFor="system"
              className="text-sm font-medium text-gray-900 dark:text-white cursor-pointer"
            >
              System Preference
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

// 7. Notification Settings Form
interface NotificationSettingsFormProps {
  notificationData: NotificationSettings;
}

function NotificationSettingsForm({
  notificationData,
}: NotificationSettingsFormProps) {
  const [notifications, setNotifications] =
    useState<NotificationSettings>(notificationData);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleToggle = (key: keyof NotificationSettings) => {
    setNotifications({
      ...notifications,
      [key]: !notifications[key],
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatus(null);

    const response = await updateNotifications(notifications);

    if (response.success) {
      setStatus({
        type: "success",
        message: "Notification preferences updated!",
      });
    } else {
      setStatus({
        type: "error",
        message: response.error || "Failed to update preferences",
      });
    }

    setSaving(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 animate-in fade-in duration-300"
    >
      <div>
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">
          Notifications
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Manage how you receive updates.
        </p>
      </div>
      <hr className="border-gray-200 dark:border-gray-700" />

      {/* Status Message */}
      {status && <StatusMessage type={status.type} message={status.message} />}

      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
              Email Digest
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Receive a weekly summary of your activity and progress.
            </p>
          </div>
          <input
            type="checkbox"
            checked={notifications.emailDigest}
            onChange={() => handleToggle("emailDigest")}
            className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
        </div>

        <hr className="border-gray-100 dark:border-gray-800" />

        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
              New Questions
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Get notified when new questions are added to your favorite topics.
            </p>
          </div>
          <input
            type="checkbox"
            checked={notifications.newQuestions}
            onChange={() => handleToggle("newQuestions")}
            className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
        </div>

        <hr className="border-gray-100 dark:border-gray-800" />

        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
              Product Updates
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Receive news about platform features and improvements.
            </p>
          </div>
          <input
            type="checkbox"
            checked={notifications.productUpdates}
            onChange={() => handleToggle("productUpdates")}
            className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
        </div>
      </div>

      <div className="pt-4">
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white text-sm font-medium rounded-md shadow-sm transition-colors"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Preferences
            </>
          )}
        </button>
      </div>
    </form>
  );
}
