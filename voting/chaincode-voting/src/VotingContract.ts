import { Context, Contract } from 'fabric-contract-api';
import * as fs from 'fs';
import { createPublicKey, verify } from 'crypto';

export class VotingContract extends Contract {
  // Load the Auth service public key once
  private pubKey = createPublicKey(
    fs.readFileSync('crypto/auth_public.pem', 'utf8')
  );

  /**
   * castVote
   * @param ctx Fabric transaction context
   * @param token The cleartext vote token (m) issued by Auth
   * @param candidate The candidate name to vote for
   * @param signature The Base64-encoded RSA signature (s) over the token
   */
  public async castVote(
    ctx: Context,
    token: string,
    candidate: string,
    signature: string
  ): Promise<void> {
    // 1) Verify the RSA signature using SHA-256 + PKCS#1 v1.5 padding
    const valid = verify(
      null,                            // default = SHA256+RSA
      Buffer.from(token, 'utf8'),      
      this.pubKey,
      Buffer.from(signature, 'base64')
    );
    if (!valid) {
      throw new Error('❌ Invalid vote token signature');
    }

    // 2) Validate candidate against your known list
    const cands: string[] = JSON.parse(
      fs.readFileSync('config/candidates.json', 'utf8')
    );
    if (!cands.includes(candidate)) {
      throw new Error(`❌ Unknown candidate: ${candidate}`);
    }

    // 3) Prevent replay by ensuring this token hasn’t been used
    const existing = await ctx.stub.getState(token);
    if (existing && existing.length > 0) {
      throw new Error('❌ Token already used');
    }

    // 4) Record the vote: key = token, value = candidate
    await ctx.stub.putState(token, Buffer.from(candidate, 'utf8'));
  }

  /**
   * tallyAll
   * @param ctx Fabric transaction context
   * @returns A JSON string mapping candidate names to vote counts
   */
  public async tallyAll(ctx: Context): Promise<string> {
    const iterator = await ctx.stub.getStateByRange('', '');
    const results: Record<string, number> = {};
    
    // Iterate through all entries
    let res = await iterator.next();
    while (!res.done) {
      if (res.value && res.value.value) {
        // Convert the stored Uint8Array to string using Buffer
        const candidateName = Buffer.from(res.value.value as Uint8Array).toString('utf8');
        results[candidateName] = (results[candidateName] || 0) + 1;
      }
      res = await iterator.next();
    }
    await iterator.close();

    return JSON.stringify(results);
  }
}
