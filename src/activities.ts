import Anthropic from '@anthropic-ai/sdk';
import type { BatchCreateParams } from '@anthropic-ai/sdk/resources/messages.mjs';
import { sleep } from './lib/sleep';

const anthropic = new Anthropic();

export async function createBatch(
  messages: SimpleBatchMessage[],
): Promise<string> {
  /**
   * Let's naively assume that the messages are already in the correct format.
   * In a real-world scenario, you would want to validate and possibly transform
   * the messages to ensure they meet the requirements of the API.
   */
  const requests: BatchCreateParams.Request[] = messages.map((message) => ({
    custom_id: message.id,
    params: {
      model: 'claude-3-7-sonnet-latest',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: message.content,
        },
      ],
    },
  }));

  const batch = await anthropic.beta.messages.batches.create({
    requests,
  });

  console.log('Batch created', batch.id);
  console.log('Processing status', batch.processing_status);

  return batch.id;
}

export async function checkBatchStatus(id: string) {
  try {
    const batch = await anthropic.beta.messages.batches.retrieve(id);

    console.log('Batch status:', batch.processing_status);
    console.log('Request counts:', batch.request_counts);
    console.log({ batch });

    return batch.processing_status === 'ended';
  } catch (error) {
    console.error('Error checking batch status:', error);
    return false;
  }
}

export async function pollUntilComplete(id: string, interval = 60000) {
  let isComplete = false;

  while (!isComplete) {
    isComplete = await checkBatchStatus(id);

    if (isComplete) {
      console.log('Batch processing complete');
      return true;
    }

    console.log(
      `Batch still processing. Checking again in ${interval / 1000} seconds...`,
    );

    await sleep(interval);
  }
}

export async function getBatchResults(id: string) {
  try {
    const results = await anthropic.beta.messages.batches.results(id);
    const successes = [];
    const errors = [];

    for await (const entry of results) {
      if (entry.result.type === 'succeeded') {
        successes.push({
          id: entry.custom_id,
          content: entry.result.message.content,
        });
      } else if (entry.result.type === 'errored') {
        errors.push({
          id: entry.custom_id,
          error: entry.result.error,
        });
      }
    }

    return { successes, errors };
  } catch (error) {
    console.error('Error retrieving batch results:', error);
  }
}
