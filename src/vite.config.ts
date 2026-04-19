import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const date = new Date();
const yy = String(date.getFullYear()).slice(-2);
const MM = String(date.getMonth() + 1).padStart(2, '0');
const dd = String(date.getDate()).padStart(2, '0');
const hh = String(date.getHours()).padStart(2, '0');
const mm = String(date.getMinutes()).padStart(2, '0');
const appVersion = `v.${yy}${MM}${dd}_${hh}${mm}`;

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/TxcParser/',
  define: {
    __APP_VERSION__: JSON.stringify(appVersion),
  },
  build: {
    outDir: '../docs',
    emptyOutDir: true
  }
})
