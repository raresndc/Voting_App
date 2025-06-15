"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VotingContract = void 0;
const fabric_contract_api_1 = require("fabric-contract-api");
const fs = __importStar(require("fs"));
const crypto_1 = require("crypto");
class VotingContract extends fabric_contract_api_1.Contract {
    constructor() {
        super(...arguments);
        // Load the Auth service public key once
        this.pubKey = (0, crypto_1.createPublicKey)(fs.readFileSync('crypto/auth_public.pem', 'utf8'));
    }
    /**
     * castVote
     * @param ctx Fabric transaction context
     * @param token The cleartext vote token (m) issued by Auth
     * @param candidate The candidate name to vote for
     * @param signature The Base64-encoded RSA signature (s) over the token
     */
    async castVote(ctx, token, candidate, signature) {
        // 1) Verify the RSA signature using SHA-256 + PKCS#1 v1.5 padding
        const valid = (0, crypto_1.verify)(null, // default = SHA256+RSA
        Buffer.from(token, 'utf8'), this.pubKey, Buffer.from(signature, 'base64'));
        if (!valid) {
            throw new Error('❌ Invalid vote token signature');
        }
        // 2) Validate candidate against your known list
        const cands = JSON.parse(fs.readFileSync('config/candidates.json', 'utf8'));
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
    async tallyAll(ctx) {
        const iterator = await ctx.stub.getStateByRange('', '');
        const results = {};
        // Iterate through all entries
        let res = await iterator.next();
        while (!res.done) {
            if (res.value && res.value.value) {
                // Convert the stored Uint8Array to string using Buffer
                const candidateName = Buffer.from(res.value.value).toString('utf8');
                results[candidateName] = (results[candidateName] || 0) + 1;
            }
            res = await iterator.next();
        }
        await iterator.close();
        return JSON.stringify(results);
    }
}
exports.VotingContract = VotingContract;
