/**
 * Browser Fingerprinting Utility
 * Creates a unique identifier based on browser characteristics
 * Note: This is not 100% foolproof but provides reasonable duplicate prevention
 */

export async function generateFingerprint(): Promise<string> {
  const components = [
    // Screen properties
    screen.width,
    screen.height,
    screen.colorDepth,
    screen.pixelDepth,
    
    // Timezone
    Intl.DateTimeFormat().resolvedOptions().timeZone,
    new Date().getTimezoneOffset(),
    
    // Browser/Platform
    navigator.userAgent,
    navigator.language,
    navigator.languages?.join(',') || '',
    navigator.platform,
    navigator.hardwareConcurrency || 0,
    navigator.maxTouchPoints || 0,
    
    // Canvas fingerprint
    await getCanvasFingerprint(),
    
    // WebGL fingerprint
    getWebGLFingerprint(),
  ];

  const fingerprint = components.join('|');
  return hashString(fingerprint);
}

async function getCanvasFingerprint(): Promise<string> {
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return 'no-canvas';
    
    canvas.width = 200;
    canvas.height = 50;
    
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillStyle = '#f60';
    ctx.fillRect(125, 1, 62, 20);
    ctx.fillStyle = '#069';
    ctx.fillText('Aegean Hallyu', 2, 15);
    ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
    ctx.fillText('K-pop Greece', 4, 17);
    
    return canvas.toDataURL();
  } catch {
    return 'canvas-error';
  }
}

function getWebGLFingerprint(): string {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') as WebGLRenderingContext | null;
    if (!gl) return 'no-webgl';
    
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (!debugInfo) return 'no-debug-info';
    
    const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
    const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
    
    return `${vendor}|${renderer}`;
  } catch {
    return 'webgl-error';
  }
}

async function hashString(str: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Get or create a persistent user session token
 */
export function getUserSessionToken(): string {
  const STORAGE_KEY = 'aegean_hallyu_session_token';
  
  let token = localStorage.getItem(STORAGE_KEY);
  
  if (!token) {
    // Generate a random session token
    token = generateRandomToken();
    localStorage.setItem(STORAGE_KEY, token);
  }
  
  return token;
}

function generateRandomToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Get or prompt for user's age group
 */
export function getUserAgeGroup(): string | null {
  const STORAGE_KEY = 'aegean_hallyu_age_group';
  return localStorage.getItem(STORAGE_KEY);
}

export function setUserAgeGroup(ageGroup: string): void {
  const STORAGE_KEY = 'aegean_hallyu_age_group';
  localStorage.setItem(STORAGE_KEY, ageGroup);
}

/**
 * Create a composite user identifier combining fingerprint and session token
 */
export async function getUserIdentifier(): Promise<string> {
  const fingerprint = await generateFingerprint();
  const sessionToken = getUserSessionToken();
  
  // Combine both for better uniqueness
  return await hashString(`${fingerprint}:${sessionToken}`);
}
