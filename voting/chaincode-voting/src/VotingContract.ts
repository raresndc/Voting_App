// src/VotingContract.ts

import {
    Context,
    Contract,
    Info,
    Returns,
    Transaction
  } from 'fabric-contract-api';
  
  interface VoteRecord { candidate: string }
  
  @Info({ title: 'VotingContract', description: 'Anonymously cast and tally votes' })
  export class VotingContract extends Contract {
    @Transaction(true)
    public async castVote(
      ctx: Context,
      voteId: string,
      candidate: string
    ): Promise<void> {
      const exists = await ctx.stub.getState(voteId);
      if (exists && exists.length) {
        throw new Error(`Vote ${voteId} already recorded`);
      }
      const record: VoteRecord = { candidate };
      await ctx.stub.putState(voteId, Buffer.from(JSON.stringify(record)));
    }
  
    @Transaction(false)
    @Returns('string')
    public async tallyAll(ctx: Context): Promise<string> {
      const iterator = await ctx.stub.getStateByRange('', '');
      const counts: Record<string, number> = {};
  
      // manual iteration instead of `for await…of`
      let res = await iterator.next();
      while (!res.done) {
        const { candidate } = JSON.parse(res.value.value.toString()) as VoteRecord;
        counts[candidate] = (counts[candidate] || 0) + 1;
        res = await iterator.next();
      }
      await iterator.close();
      return JSON.stringify(counts);
    }
  }
  