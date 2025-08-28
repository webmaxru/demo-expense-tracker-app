// Builds the backend into a single bundle using esbuild
const esbuild = require('esbuild');
const path = require('path');
const fs = require('fs');

const outdir = path.resolve(__dirname, '..', 'dist');

// Ensure logs directory exists at runtime
const ensureDirs = () => {
  const logsDir = path.resolve(__dirname, '..', 'logs');
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }
};

ensureDirs();

esbuild.build({
  entryPoints: [path.resolve(__dirname, '..', 'src', 'index.js')],
  outfile: path.join(outdir, 'index.js'),
  platform: 'node',
  target: ['node18'],
  bundle: true,
  minify: false,
  sourcemap: true,
  external: [
    // Native/optional deps; let Node resolve these at runtime if used
    'pg-native',
    '@prisma/client',
    'prisma',
    'sharp',
  ],
}).then(() => {
  console.log('Backend bundled successfully to dist/index.js');
}).catch((err) => {
  console.error(err);
  process.exit(1);
});
