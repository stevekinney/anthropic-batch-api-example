import { Worker } from '@temporalio/worker';
import { createRequire } from 'node:module';
import process from 'node:process';
import * as activities from './activities';

const require = createRequire(import.meta.url);
const workflowsPath = require.resolve('./workflow');

const worker = await Worker.create({
  workflowsPath,
  activities,
  taskQueue: 'batch-requests',
});

await worker.run();

process.on('beforeExit', (code) => {
  console.log(`Shutting down with code ${code}…`);
  worker.shutdown();
});
