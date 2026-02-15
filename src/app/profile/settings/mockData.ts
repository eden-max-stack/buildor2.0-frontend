import { UserSettings } from './models';

/**
 * Mock settings data for development and testing
 * Replace this with actual API calls in production
 */

export const mockUserSettings: UserSettings = {
  publicProfile: {
    displayName: "Alex Chen",
    bio: "Full-stack enthusiast building scalable apps. Loves React, Node.js, and coffee. ☕️",
    website: "https://alexchen.dev",
    githubUsername: "alex_dev",
    avatarUrl: "", // Empty by default, or use a placeholder image URL
    location: "San Francisco, CA",
  },
  
  account: {
    email: "alex.chen@example.com",
    username: "alex_dev",
    twoFactorEnabled: false,
    lastPasswordChange: "2024-01-15",
  },
  
  appearance: {
    theme: "dark",
    fontSize: "medium",
    compactMode: false,
  },
  
  notifications: {
    emailDigest: true,
    newQuestions: false,
    productUpdates: true,
    contestReminders: true,
    achievementAlerts: true,
    professorFeedback: true,
  },
};

/**
 * Mock API responses for testing
 */

export const mockApiResponses = {
  success: {
    success: true,
    message: "Settings updated successfully",
    updatedAt: new Date().toISOString(),
  },
  
  error: {
    success: false,
    error: "Failed to update settings",
  },
  
  validationError: {
    success: false,
    error: "Validation failed",
  },
};