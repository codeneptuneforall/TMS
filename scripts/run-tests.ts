import { spawnSync } from 'node:child_process';

const files = ['src/utils/cn.test.ts', 'server/smoke.test.ts'];
for (const file of files) {
  console.log(`\nRunning ${file}...`);
  const result = spawnSync('npx', ['tsx', file], { stdio: 'inherit', shell: true });
  if (result.status !== 0) {
    console.error(`Failed: ${file}`);
    process.exit(result.status ?? 1);
  }
}
console.log('\nAll tests passed');