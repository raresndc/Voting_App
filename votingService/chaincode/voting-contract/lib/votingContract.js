'use strict';

const { Contract } = require('fabric-contract-api');

class VotingContract extends Contract {
  
  // Helper to form the state key for a vote
  _voteKey(evuid) {
    return `vote::${evuid}`;
  }

  // Casts a vote if the evuid has not yet voted
  async CastVote(ctx, evuid, candidateId) {
    const voteKey = this._voteKey(evuid);
    const existing = await ctx.stub.getState(voteKey);
    if (existing && existing.length > 0) {
      throw new Error(`EVUID ${evuid} has already voted`);
    }
    await ctx.stub.putState(voteKey, Buffer.from(candidateId));
    return `Vote recorded for ${candidateId}`;
  }

  // Returns 'true' if evuid already used
  async HasVoted(ctx, evuid) {
    const data = await ctx.stub.getState(this._voteKey(evuid));
    return (data && data.length > 0).toString();
  }

  // Scans all votes and returns the count for candidateId
  async GetVoteCount(ctx, candidateId) {
    const iterator = await ctx.stub.getStateByRange('vote::', 'vote::~');
    let count = 0;
    while (true) {
      const res = await iterator.next();
      if (res.value && res.value.value.toString() === candidateId) {
        count++;
      }
      if (res.done) {
        await iterator.close();
        break;
      }
    }
    return count.toString();
  }
}

module.exports = VotingContract;
