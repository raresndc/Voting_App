"use strict";
// src/VotingContract.ts
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VotingContract = void 0;
const fabric_contract_api_1 = require("fabric-contract-api");
let VotingContract = class VotingContract extends fabric_contract_api_1.Contract {
    async castVote(ctx, voteId, candidate) {
        const exists = await ctx.stub.getState(voteId);
        if (exists && exists.length) {
            throw new Error(`Vote ${voteId} already recorded`);
        }
        const record = { candidate };
        await ctx.stub.putState(voteId, Buffer.from(JSON.stringify(record)));
    }
    async tallyAll(ctx) {
        const iterator = await ctx.stub.getStateByRange('', '');
        const counts = {};
        // manual iteration instead of `for await…of`
        let res = await iterator.next();
        while (!res.done) {
            const { candidate } = JSON.parse(res.value.value.toString());
            counts[candidate] = (counts[candidate] || 0) + 1;
            res = await iterator.next();
        }
        await iterator.close();
        return JSON.stringify(counts);
    }
};
__decorate([
    (0, fabric_contract_api_1.Transaction)(true),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String, String]),
    __metadata("design:returntype", Promise)
], VotingContract.prototype, "castVote", null);
__decorate([
    (0, fabric_contract_api_1.Transaction)(false),
    (0, fabric_contract_api_1.Returns)('string'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context]),
    __metadata("design:returntype", Promise)
], VotingContract.prototype, "tallyAll", null);
VotingContract = __decorate([
    (0, fabric_contract_api_1.Info)({ title: 'VotingContract', description: 'Anonymously cast and tally votes' })
], VotingContract);
exports.VotingContract = VotingContract;
