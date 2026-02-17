// --- API SERVICE FOR SETTINGS ---

import {
  UserSettings,
  PublicProfileUpdatePayload,
  ChangePasswordData,
  AppearanceUpdatePayload,
  NotificationUpdatePayload,
  ApiResponse,
  SettingsUpdateResponse,
} from './models';
import { mockUserSettings, mockApiResponses } from './mockData';

// API Configuration
const API_BASE_URL = '';

// Temporarily use mock data for development
const USE_MOCK_DATA = false;

// Helper function for API requests
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        // Add authentication header if needed
        // 'Authorization': `Bearer ${getAuthToken()}`,
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || 'An error occurred',
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('API request failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}

// --- SETTINGS API FUNCTIONS ---

/**
 * Fetch all user settings
 */
export async function fetchUserSettings(): Promise<ApiResponse<UserSettings>> {
  try {
    const response = await fetch(`/api/profile`);

    const data = await response.json();

    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch settings',
    };
  }
}


/**
 * Update public profile settings
 */
export async function updatePublicProfile(
  data: PublicProfileUpdatePayload
): Promise<ApiResponse<SettingsUpdateResponse>> {
  try {
    const response = await fetch(`/api/profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    return {
      success: response.ok,
      data: result,
      error: result?.error,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update profile',
    };
  }
}


/**
 * Upload profile avatar
 */
export async function uploadAvatar(
  file: File
): Promise<ApiResponse<{ avatarUrl: string }>> {
  if (USE_MOCK_DATA) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            avatarUrl: URL.createObjectURL(file),
          },
        });
      }, 500);
    });
  }

  const formData = new FormData();
  formData.append('avatar', file);

  try {
    const response = await fetch(`${API_BASE_URL}/api/settings/avatar`, {
      method: 'POST',
      body: formData,
      // Note: Don't set Content-Type header for FormData
      // headers: {
      //   'Authorization': `Bearer ${getAuthToken()}`,
      // },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || 'Upload failed',
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed',
    };
  }
}

/**
 * Change password
 */
export async function changePassword(
  data: ChangePasswordData
): Promise<ApiResponse<SettingsUpdateResponse>> {
  if (USE_MOCK_DATA) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: mockApiResponses.success as SettingsUpdateResponse,
        });
      }, 500);
    });
  }
  return apiRequest<SettingsUpdateResponse>('/api/settings/change-password', {
    method: 'POST',
    body: JSON.stringify({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    }),
  });
}

/**
 * Delete user account
 */
export async function deleteAccount(
  password: string
): Promise<ApiResponse<{ message: string }>> {
  if (USE_MOCK_DATA) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: { message: 'Account deleted successfully' },
        });
      }, 500);
    });
  }
  return apiRequest<{ message: string }>('/api/settings/delete-account', {
    method: 'DELETE',
    body: JSON.stringify({ password }),
  });
}

/**
 * Update appearance settings
 */
export async function updateAppearance(
  data: AppearanceUpdatePayload
): Promise<ApiResponse<SettingsUpdateResponse>> {
  try {
    const response = await fetch(`/api/profile-settings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    return {
      success: response.ok,
      data: result,
      error: result?.error,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update appearance',
    };
  }
}


/**
 * Update notification preferences
 */
export async function updateNotifications(
  data: NotificationUpdatePayload
): Promise<ApiResponse<SettingsUpdateResponse>> {
  try {
    const response = await fetch(`/api/profile-settings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    return {
      success: response.ok,
      data: result,
      error: result?.error,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update notifications',
    };
  }
}


// --- HELPER FUNCTIONS ---

/**
 * Validate file size and type for avatar upload
 */
export function validateAvatarFile(file: File): { valid: boolean; error?: string } {
  const maxSize = 800 * 1024; // 800KB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Only JPG, PNG, and GIF files are allowed',
    };
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'File size must be less than 800KB',
    };
  }

  return { valid: true };
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): { valid: boolean; error?: string } {
  if (password.length < 8) {
    return {
      valid: false,
      error: 'Password must be at least 8 characters long',
    };
  }

  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);

  if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
    return {
      valid: false,
      error: 'Password must contain uppercase, lowercase, and numbers',
    };
  }

  return { valid: true };
}