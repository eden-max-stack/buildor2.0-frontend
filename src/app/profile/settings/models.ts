// --- SETTINGS MODELS ---

// Theme preferences
export type ThemeMode = "light" | "dark" | "system";

// --- PUBLIC PROFILE SETTINGS ---

export interface PublicProfileSettings {
  displayName: string;
  bio: string;
  website: string;
  githubUsername: string;
  avatarUrl?: string;
  location?: string;
}

export interface PublicProfileFormData {
  displayName: string;
  bio: string;
  website: string;
  githubUsername: string;
}

// --- ACCOUNT SECURITY SETTINGS ---

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword?: string; // Client-side only for validation
}

export interface AccountSettings {
  email: string;
  username: string;
  twoFactorEnabled: boolean;
  lastPasswordChange?: string;
}

// --- APPEARANCE SETTINGS ---

export interface AppearanceSettings {
  theme: ThemeMode;
  fontSize?: "small" | "medium" | "large";
  compactMode?: boolean;
}

// --- NOTIFICATION SETTINGS ---

export interface NotificationSettings {
  emailDigest: boolean;
  newQuestions: boolean;
  productUpdates: boolean;
  contestReminders?: boolean;
  achievementAlerts?: boolean;
  professorFeedback?: boolean;
}

// --- COMPLETE SETTINGS DATA ---

export interface UserSettings {
  publicProfile: PublicProfileSettings;
  account: AccountSettings;
  appearance: AppearanceSettings;
  notifications: NotificationSettings;
}

// --- API RESPONSE TYPES ---

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface SettingsUpdateResponse {
  success: boolean;
  message: string;
  updatedAt: string;
}

// --- FORM SUBMISSION TYPES ---

export interface PublicProfileUpdatePayload {
  displayName?: string;
  bio?: string;
  website?: string;
  githubUsername?: string;
  location?: string;
}

export interface AppearanceUpdatePayload {
  theme: ThemeMode;
  fontSize?: "small" | "medium" | "large";
  compactMode?: boolean;
}

export interface NotificationUpdatePayload {
  emailDigest?: boolean;
  newQuestions?: boolean;
  productUpdates?: boolean;
  contestReminders?: boolean;
  achievementAlerts?: boolean;
  professorFeedback?: boolean;
}

// --- VALIDATION TYPES ---

export interface ValidationError {
  field: string;
  message: string;
}

export interface FormValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}