# VotingContract Chaincode

A simple Hyperledger Fabric chaincode written in TypeScript for anonymous voting and tallying results.

## Features

* **Cast Vote:** Users can cast an anonymous vote for a candidate. Each vote is uniquely identified.
* **Tally Votes:** Anyone can retrieve the count of votes per candidate.

## Structure

* `src/VotingContract.ts` — Main chaincode implementation.
* `dist/VotingContract.js` — Compiled JavaScript output for Fabric runtime.
* `package.json` — Project dependencies and scripts.
* `tsconfig.json` — TypeScript compiler configuration.

## Usage

### Prerequisites

* [Node.js (v18+)](https://nodejs.org/)
* [npm](https://www.npmjs.com/)
* [Hyperledger Fabric environment](https://hyperledger-fabric.readthedocs.io/)

### Installation

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Compile TypeScript to JavaScript:**

   ```bash
   npm run build
   ```

   The compiled chaincode will appear in the `dist/` directory.

### Chaincode Functions

#### `castVote(ctx, voteId, candidate)`

* **Description:** Casts a vote for a candidate. Each `voteId` must be unique.
* **Parameters:**

  * `voteId` (`string`): Unique identifier for the vote (e.g., voter token, hash).
  * `candidate` (`string`): Name or ID of the candidate.
* **Throws:** Error if the `voteId` has already been used.

#### `tallyAll(ctx)`

* **Description:** Tallies all votes and returns a JSON object with the count for each candidate.
* **Returns:** `string` — JSON representation of `{ candidate: voteCount, ... }`

### Example

```javascript
// Example castVote invocation
await contract.submitTransaction('castVote', 'uniqueVoteId123', 'Alice');

// Example tallyAll invocation
const result = await contract.evaluateTransaction('tallyAll');
console.log(JSON.parse(result)); // { "Alice": 1 }
```

### Development

* **Start in development:**

  ```bash
  npm start
  ```

  (Runs the compiled chaincode with Node.js)

* **TypeScript settings:** See `tsconfig.json` for strict typing, decorators, and output directory configuration.

## Dependencies

* [`fabric-contract-api`](https://www.npmjs.com/package/fabric-contract-api)
* [`fabric-shim`](https://www.npmjs.com/package/fabric-shim)
* `typescript`, `ts-node`, `@types/node` for development

## Notes

* This contract is intended as a minimal voting proof-of-concept for Hyperledger Fabric chaincode.
* Votes are stored with the provided `voteId` key and can only be cast once per ID.
* Votes are **not** encrypted or otherwise protected at the storage layer—ensure your application enforces anonymity and security.


---
