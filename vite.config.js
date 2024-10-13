import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": "/src", // Use the root-based alias directly
    },
  },
});

// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import netlify from "vite-plugin-netlify"; // Import Netlify plugin

// export default defineConfig({
//   plugins: [react(), netlify()],
//   resolve: {
//     alias: {
//       "@": "/src",
//     },
//   },
// });
