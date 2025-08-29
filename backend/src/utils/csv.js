/**
 * CSV utility functions for proper escaping and formatting
 */

/**
 * Escapes a CSV field value by:
 * - Wrapping in quotes if contains comma, quote, or newline
 * - Doubling any quotes inside the value
 * @param {string|null|undefined} value - The value to escape
 * @returns {string} - The escaped CSV field value
 */
const escapeCsvField = (value) => {
  if (value == null || value === '') {
    return '';
  }
  
  const stringValue = String(value);
  
  // Check if escaping is needed (contains comma, quote, or newline)
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n') || stringValue.includes('\r')) {
    // Double any quotes and wrap in quotes
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  
  return stringValue;
};

/**
 * Converts an array of objects to CSV format
 * @param {Array} data - Array of objects to convert
 * @param {Array} headers - Array of header strings
 * @param {Function} rowMapper - Function to map each data item to array of values
 * @returns {string} - CSV formatted string
 */
const toCsv = (data, headers, rowMapper) => {
  const csvHeaders = headers.map(escapeCsvField).join(',');
  
  if (!data || data.length === 0) {
    return csvHeaders;
  }
  
  const csvRows = data.map(item => {
    const values = rowMapper(item);
    return values.map(escapeCsvField).join(',');
  });
  
  return [csvHeaders, ...csvRows].join('\n');
};

module.exports = {
  escapeCsvField,
  toCsv
};