"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const axios_1 = __importDefault(require("axios"));
const pg_1 = require("pg");
const fabric_1 = require("./fabric");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
const pool = new pg_1.Pool({ connectionString: process.env.PG_CONN });
async function ensureSchema() {
    // Run your DDL on startup—using IF NOT EXISTS to avoid errors on repeat runs.
    await pool.query(`CREATE TABLE IF NOT EXISTS votes (
       vote_id TEXT PRIMARY KEY,
       user_id TEXT NOT NULL,
       candidate TEXT NOT NULL,
       ts TIMESTAMP NOT NULL DEFAULT now()
     );`);
}
async function startServer() {
    // 1) Make sure the table exists (or is created)
    try {
        await ensureSchema();
        console.log('✔️ votes table is ready');
    }
    catch (err) {
        console.error('✖️ failed to ensure schema:', err);
        process.exit(1);
    }
    // 2) JWT middleware
    app.use(async (req, res, next) => {
        const authHeader = req.header('Authorization');
        const token = authHeader === null || authHeader === void 0 ? void 0 : authHeader.split(' ')[1];
        if (!token) {
            res.status(401).send('Missing token');
            return;
        }
        try {
            const payload = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            req.user = payload;
            next();
        }
        catch (err) {
            res.status(401).send('Invalid token');
            return;
        }
    });
    // 3) Identity check middleware (only for /vote)
    app.use('/vote', async (req, res, next) => {
        const user = req.user;
        const userId = user.sub;
        const ok = await axios_1.default.post(`${process.env.ID_SERVICE_URL}/verify`, { userId });
        if (!ok.data.verified) {
            res.status(403).send('Identity not verified');
            return;
        }
        next();
    });
    // 4) POST /vote
    app.post('/vote', async (req, res) => {
        const { candidate } = req.body;
        const user = req.user;
        const userId = user.sub;
        const voteId = `${userId}-${Date.now()}`;
        // a) submit to Fabric
        const contract = await (0, fabric_1.getContract)();
        await contract.submitTransaction('castVote', voteId, candidate);
        // b) record in Postgres
        await pool.query('INSERT INTO votes(vote_id, user_id, candidate, ts) VALUES($1,$2,$3,now())', [voteId, userId, candidate]);
        res.send({ success: true });
    });
    // 5) GET /results
    app.get('/results', async (_req, res) => {
        const { rows } = await pool.query(`SELECT candidate, COUNT(*) AS count FROM votes GROUP BY candidate`);
        res.send(rows);
    });
    // 6) Start listening
    app.listen(process.env.PORT, () => {
        console.log(`Voting service listening on ${process.env.PORT}`);
    });
}
// Kick things off
startServer();
