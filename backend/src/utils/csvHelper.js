/**
 * CSV utility functions for transaction export
 */

/**
 * Escape CSV field value by wrapping in quotes and escaping internal quotes
 * @param {string|number} value - The value to escape
 * @returns {string} - The escaped CSV field
 */
function escapeCsvField(value) {
  if (value === null || value === undefined) {
    return '';
  }
  
  const stringValue = String(value);
  
  // If the value contains comma, newline, or quote, wrap it in quotes
  if (stringValue.includes(',') || stringValue.includes('\n') || stringValue.includes('"')) {
    // Escape internal quotes by doubling them
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  
  return stringValue;
}

/**
 * Convert array of transaction objects to CSV format
 * @param {Array} transactions - Array of transaction objects with category info
 * @returns {string} - CSV formatted string
 */
function transactionsToCsv(transactions) {
  // Define CSV headers in the required order
  const headers = [
    'id',
    'date',
    'type',
    'categoryName',
    'description',
    'amount',
    'currency',
    'createdAt',
    'updatedAt'
  ];
  
  // Create header row
  const headerRow = headers.map(escapeCsvField).join(',');
  
  // Create data rows
  const dataRows = transactions.map(transaction => {
    const row = [
      transaction.id,
      new Date(transaction.date).toISOString().split('T')[0], // Format as YYYY-MM-DD
      transaction.type,
      transaction.category ? transaction.category.name : '',
      transaction.description || '',
      parseFloat(transaction.amount).toFixed(2), // Ensure 2 decimals
      'USD', // Fixed currency as specified
      transaction.createdAt,
      transaction.updatedAt
    ];
    
    return row.map(escapeCsvField).join(',');
  });
  
  // Combine header and data rows
  return [headerRow, ...dataRows].join('\n');
}

/**
 * Generate filename for export with timestamp
 * @param {string} format - Export format (csv or json)
 * @returns {string} - Formatted filename
 */
function generateExportFilename(format) {
  const now = new Date();
  const timestamp = now.toISOString()
    .replace(/[-:]/g, '')
    .replace('T', '_')
    .split('.')[0]; // YYYYMMDD_HHmmss
  
  return `transactions_${timestamp}.${format}`;
}

module.exports = {
  escapeCsvField,
  transactionsToCsv,
  generateExportFilename
};