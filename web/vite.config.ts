import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from "vite-tsconfig-paths";

function debugEnvPlugin(): Plugin {
  return {
    name: 'debug-env',
    configResolved(config) {
      const keys = ['VITE_CLERK_PUBLISHABLE_KEY', 'VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY', 'VITE_API_BASE_URL']
      for (const k of keys) {
        const v = (config.env as Record<string, string>)[k]
        console.log(`[debug-env] ${k}=${v ? v.slice(0, 20) + '...' : '(empty)'}`)
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  build: {
    sourcemap: 'hidden',
  },
  plugins: [
    react({
      babel: {
        plugins: [
          'react-dev-locator',
        ],
      },
    }),
    tsconfigPaths(),
    debugEnvPlugin(),
  ],
})
