import messages from '../messages.json';
import { createBatch, getBatchResults, pollUntilComplete } from './activities';

const batchId = await createBatch(messages);
await pollUntilComplete(batchId);
const results = await getBatchResults(batchId);

console.log(results);
