import open from 'open';

try {
  process.loadEnvFile();
} catch (error) {
  console.error(error);
  process.exit(1);
}

const DEFAULT_URL = 'http://localhost:3000/rpc';
const URL = process.env.NEXT_PUBLIC_API_URL ?? DEFAULT_URL;

console.log(`\n🚀 Opening OpenAPI at: \x1b[36m${URL}\x1b[0m\n`);

open(URL);
