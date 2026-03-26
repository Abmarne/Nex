/**
 * Simple environment variable validator.
 * In an enterprise app, this ensures we don't start the server if critical configuration is missing.
 */

const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
] as const;

export function validateEnv() {
  const missing = requiredEnvVars.filter((v) => !process.env[v]);
  
  if (missing.length > 0) {
    const errorMsg = `[CRITICAL] Missing required environment variables: ${missing.join(', ')}`;
    if (process.env.NODE_ENV === 'production') {
      throw new Error(errorMsg);
    } else {
      console.error(errorMsg);
    }
  }
}

// Auto-validate on import in layout.tsx or server components
if (typeof window === 'undefined') {
  validateEnv();
}
