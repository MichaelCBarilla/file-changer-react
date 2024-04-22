import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';
import replace from '@rollup/plugin-replace';

const env = dotenv.config().parsed;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    replace({
      __VITE_ENV__: JSON.stringify(env),
    }),
    react(),
  ],
});
