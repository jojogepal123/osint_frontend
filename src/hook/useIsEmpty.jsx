import { useMemo } from "react";

// Helper function: checks if value is considered "empty"
const isEmptyValue = (value) => {
  if (value == null) return true; // null or undefined
  if (typeof value === 'string' && value.trim() === '') return true;
  if (Array.isArray(value) && value.length === 0) return true;
  if (typeof value === 'object' && Object.keys(value).length === 0) return true;
  return false;
};

// Recursive function: deeply check nested objects
const isDeepEmpty = (obj) => {
  if (typeof obj !== 'object' || obj === null) return isEmptyValue(obj);
  for (const key in obj) {
    if (!isEmptyValue(obj[key])) {
      if (typeof obj[key] === 'object') {
        if (!isDeepEmpty(obj[key])) return false;
      } else {
        return false;
      }
    }
  }
  return true;
};

// Main React hook
export const useIsEmpty = (data) => {
  return useMemo(() => {
    return isDeepEmpty(data);
  }, [data]);
};
