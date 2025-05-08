# Anthropic Batch API Example

This is the companion code for my post on [Using Anthropic's Message Batch API with Temporal](https://stevekinney.com/writing/anthropic-batch-api-with-temporal).

To install dependencies:

```bash
npm install
```

## Usage

### Basic Implementation

```bash
npx tsx src/index.ts
```

### Improved Implementation using Temporal

You're going to need to have a few things running to get all of this working:

- An instance of the [Temporal Server](https://temporal.io/setup/install-temporal-cli) running (e.g. `temporal server start-dev` from the command line).
- A worker running. `npx tsx src/worker.ts`.
- Kick off the workflow: `npx tsx/temporal.ts.
