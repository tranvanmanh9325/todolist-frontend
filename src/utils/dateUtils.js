/**
 * Utility functions for safe date handling
 */

/**
 * Safely parse a date string
 * @param {string|Date|null|undefined} dateInput - The date input to parse
 * @returns {Date|null} - Parsed date or null if invalid
 */
export const safeParseDate = (dateInput) => {
  if (!dateInput) return null;
  
  try {
    const date = new Date(dateInput);
    if (isNaN(date)) {
      console.warn('Invalid date input:', dateInput);
      return null;
    }
    return date;
  } catch (error) {
    console.warn('Error parsing date:', dateInput, error);
    return null;
  }
};

/**
 * Safely format a date to ISO string
 * @param {string|Date|null|undefined} dateInput - The date input
 * @returns {string|null} - ISO string or null if invalid
 */
export const safeToISOString = (dateInput) => {
  const date = safeParseDate(dateInput);
  return date ? date.toISOString() : null;
};

/**
 * Safely format a date to locale string
 * @param {string|Date|null|undefined} dateInput - The date input
 * @param {object} options - Intl.DateTimeFormat options
 * @returns {string} - Formatted string or fallback
 */
export const safeToLocaleString = (dateInput, options = {}) => {
  const date = safeParseDate(dateInput);
  if (!date) return 'Invalid date';
  
  try {
    return date.toLocaleString(undefined, options);
  } catch (error) {
    console.warn('Error formatting date:', dateInput, error);
    return 'Invalid date';
  }
};

/**
 * Safely format a date to date string
 * @param {string|Date|null|undefined} dateInput - The date input
 * @returns {string} - Date string or fallback
 */
export const safeToDateString = (dateInput) => {
  const date = safeParseDate(dateInput);
  if (!date) return 'Invalid date';
  
  try {
    return date.toDateString();
  } catch (error) {
    console.warn('Error formatting date:', dateInput, error);
    return 'Invalid date';
  }
};

/**
 * Safely format a date to time string
 * @param {string|Date|null|undefined} dateInput - The date input
 * @param {object} options - Intl.DateTimeFormat options
 * @returns {string} - Time string or fallback
 */
export const safeToTimeString = (dateInput, options = {}) => {
  const date = safeParseDate(dateInput);
  if (!date) return 'Invalid time';
  
  try {
    return date.toLocaleTimeString(undefined, options);
  } catch (error) {
    console.warn('Error formatting time:', dateInput, error);
    return 'Invalid time';
  }
};
