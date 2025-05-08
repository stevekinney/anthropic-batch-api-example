import { Client, Connection } from '@temporalio/client';
import { randomUUID } from 'node:crypto';

import messages from '../messages.json';
import { batchRequests } from './workflow';

/** A connection to the Temporal Server. */
const connection = await Connection.connect({});

/** This client is used to start workflows and signal them. */
const client = new Client({
  connection,
});

/**
 * This will kick off a new workflow execution.
 */
const handle = await client.workflow.start(batchRequests, {
  taskQueue: 'batch-requests',
  args: [messages],
  workflowId: `batch-${randomUUID()}`,
});

console.log(`Started workflow`, handle.workflowId);

const result = await handle.result();
console.log('Workflow result:', result);
