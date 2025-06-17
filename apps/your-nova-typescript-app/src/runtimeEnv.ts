// Workaround for the lack of runtime environment variable support in
// NextJS. The top level layout.tsx uses dynamic SSR to inject relevant env variables
// from the server runtime environment into this object so client code can access it.
export const env: Partial<ReturnType<typeof getExposedRuntimeEnv>> = {}

/**
 * Set environment variables that should be sent from the server runtime
 * to the browser here. Don't expose secrets!
 */
export function getExposedRuntimeEnv() {
  return {
    BASE_PATH: process.env.BASE_PATH,
    WANDELAPI_BASE_URL: process.env.WANDELAPI_BASE_URL,
    CELL_ID: process.env.CELL_ID,
    VERSION: process.env.VERSION,
    NODE_ENV: process.env.NODE_ENV,
    NOVA_USERNAME: process.env.NOVA_USERNAME,
    NOVA_PASSWORD: process.env.NOVA_PASSWORD,
    NOVA_ACCESS_TOKEN: process.env.NOVA_ACCESS_TOKEN,
  }
}
