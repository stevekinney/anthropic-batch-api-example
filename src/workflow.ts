import {
  continueAsNew,
  proxyActivities,
  setHandler,
  sleep,
} from '@temporalio/workflow';

import type * as activities from './activities';

const { createBatch, checkBatchStatus, getBatchResults } = proxyActivities<
  typeof activities
>({
  startToCloseTimeout: '24 hours',
  retry: {
    maximumAttempts: 5,
  },
});

export async function batchRequests(messages: SimpleBatchMessage[]) {
  // Step 1: Create the batch
  const batchId = await createBatch(messages);

  let completed = false;

  while (!completed) {
    const completed = await checkBatchStatus(batchId);
    if (completed) {
      console.log('Batch processing complete');
      return getBatchResults(batchId);
    }
    await sleep('10 seconds');
  }

  return batchId;
}
