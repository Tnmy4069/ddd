import { clsx } from 'clsx';

// Utility function to merge classNames
export function cn(...inputs) {
  return clsx(inputs);
}

// Format date and time utilities
export function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

export function formatTime(date) {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
}

export function formatDateTime(date) {
  const now = new Date();
  const messageDate = new Date(date);
  const diffMs = now - messageDate;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return formatDate(date);
}

// Validation utilities
export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password) {
  return password && password.length >= 6;
}

export function validateUsername(username) {
  const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
  return usernameRegex.test(username);
}

// String utilities
export function truncateText(text, maxLength = 100) {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

export function generateAvatarUrl(username) {
  // Generate a deterministic avatar URL based on username
  return `/avatar.svg`;
}

// Local storage utilities
export function getFromLocalStorage(key, defaultValue = null) {
  if (typeof window === 'undefined') return defaultValue;
  
  try {
    const item = localStorage.getItem(key);
    const result = item ? JSON.parse(item) : defaultValue;
    console.log(`getFromLocalStorage(${key}):`, { 
      hasItem: !!item, 
      itemLength: item?.length,
      resultType: typeof result,
      result: key === 'token' ? (result ? result.substring(0, 20) + '...' : 'null') : result
    });
    return result;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return defaultValue;
  }
}

export function setToLocalStorage(key, value) {
  if (typeof window === 'undefined') return;
  
  try {
    const jsonValue = JSON.stringify(value);
    localStorage.setItem(key, jsonValue);
    console.log(`setToLocalStorage(${key}):`, { 
      valueType: typeof value,
      jsonLength: jsonValue.length,
      preview: key === 'token' ? (value ? value.substring(0, 20) + '...' : 'null') : value
    });
  } catch (error) {
    console.error('Error writing to localStorage:', error);
  }
}

export function removeFromLocalStorage(key) {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
}

// API utilities
export function handleApiError(error) {
  if (error.response?.data?.error) {
    return error.response.data.error;
  }
  if (error.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
}
