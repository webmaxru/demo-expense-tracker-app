/**
 * Utility functions for handling file downloads
 */

/**
 * Download a blob as a file
 * @param blob - The blob to download
 * @param filename - The filename to use for the download
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.href = url;
  link.download = filename;
  
  // Append to body, click, and remove
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up the URL
  URL.revokeObjectURL(url);
}

/**
 * Generate filename with current timestamp
 * @param prefix - Filename prefix
 * @param extension - File extension
 * @returns Formatted filename
 */
export function generateFilename(prefix: string, extension: string): string {
  const now = new Date();
  const timestamp = now.toISOString()
    .replace(/[-:]/g, '')
    .replace('T', '_')
    .split('.')[0]; // YYYYMMDD_HHmmss
  
  return `${prefix}_${timestamp}.${extension}`;
}