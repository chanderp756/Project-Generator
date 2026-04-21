/**
 * API service layer for communicating with the backend.
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/**
 * Request a project generation and download the resulting ZIP.
 * @param {object} config - ProjectConfig matching the backend schema
 * @returns {Promise<Blob>} the ZIP file as a Blob
 */
export async function generateProject(config) {
  const res = await fetch(`${API_BASE}/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(config),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail || `Generation failed (${res.status})`);
  }

  return res.blob();
}

/**
 * Request a preview of the generated file tree (JSON, no ZIP).
 * @param {object} config
 * @returns {Promise<{data: Array|null, error: string|null}>}
 */
export async function previewProject(config) {
  const res = await fetch(`${API_BASE}/generate/preview`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(config),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail || `Preview failed (${res.status})`);
  }

  return res.json();
}

/**
 * Health check.
 * @returns {Promise<{status: string}>}
 */
export async function healthCheck() {
  const res = await fetch(`${API_BASE}/health`);
  return res.json();
}

/**
 * Trigger a file download from a Blob.
 */
export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  
  // Delay revocation to ensure Chrome registers the download
  setTimeout(() => URL.revokeObjectURL(url), 100);
}
