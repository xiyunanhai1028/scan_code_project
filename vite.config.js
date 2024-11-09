/*
 * @Author: dfh
 * @Date: 2024-07-23 14:56:21
 * @LastEditors: dfh
 * @Modified By: dfh
 * @describe: 
 */
import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import { resolve } from "path";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    uni(),
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src")
    }
  }
})
