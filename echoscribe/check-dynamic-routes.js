// Import Node.js modules
const fs = require('fs');
const path = require('path');

// Read the routes-manifest.json file
const manifestPath = path.join(__dirname, '.next', 'routes-manifest.json');
const routesManifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

// ✅ SAFELY access dynamicRoutes (avoid TypeError)
const dynamicRoutes = Array.isArray(routesManifest.dynamicRoutes)
  ? routesManifest.dynamicRoutes
  : [];

for (const route of dynamicRoutes) {
  console.log('Dynamic route:', route.page); // or your logic here
}
