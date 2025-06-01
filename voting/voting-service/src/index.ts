import express, { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import axios from 'axios';
import { Pool } from 'pg';
import { getContract } from './fabric';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(express.json());

const pool = new Pool({ connectionString: process.env.PG_CONN });

async function ensureSchema(): Promise<void> {
  // Run your DDL on startup—using IF NOT EXISTS to avoid errors on repeat runs.
  await pool.query(
    `CREATE TABLE IF NOT EXISTS votes (
       vote_id TEXT PRIMARY KEY,
       user_id TEXT NOT NULL,
       candidate TEXT NOT NULL,
       ts TIMESTAMP NOT NULL DEFAULT now()
     );`
  );
}

async function startServer() {
  // 1) Make sure the table exists (or is created)
  try {
    await ensureSchema();
    console.log('✔️ votes table is ready');
  } catch (err) {
    console.error('✖️ failed to ensure schema:', err);
    process.exit(1);
  }

  // 2) JWT middleware
  app.use(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.header('Authorization');
    const token = authHeader?.split(' ')[1];
    if (!token) {
      res.status(401).send('Missing token');
      return;
    }
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
      (req as any).user = payload;
      next();
    } catch (err) {
      res.status(401).send('Invalid token');
      return;
    }
  });

  // 3) Identity check middleware (only for /vote)
  app.use(
    '/vote',
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const user = (req as any).user as JwtPayload;
      const userId = user.sub as string;
      const ok = await axios.post<{ verified: boolean }>(
        `${process.env.ID_SERVICE_URL}/verify`,
        { userId }
      );
      if (!ok.data.verified) {
        res.status(403).send('Identity not verified');
        return;
      }
      next();
    }
  );

  // 4) POST /vote
  app.post('/vote', async (req: Request, res: Response): Promise<void> => {
    const { candidate } = req.body;
    const user = (req as any).user as JwtPayload;
    const userId = user.sub as string;
    const voteId = `${userId}-${Date.now()}`;

    // a) submit to Fabric
    const contract = await getContract();
    await contract.submitTransaction('castVote', voteId, candidate);

    // b) record in Postgres
    await pool.query(
      'INSERT INTO votes(vote_id, user_id, candidate, ts) VALUES($1,$2,$3,now())',
      [voteId, userId, candidate]
    );

    res.send({ success: true });
  });

  // 5) GET /results
  app.get('/results', async (_req: Request, res: Response): Promise<void> => {
    const { rows } = await pool.query(
      `SELECT candidate, COUNT(*) AS count FROM votes GROUP BY candidate`
    );
    res.send(rows);
  });

  // 6) Start listening
  app.listen(process.env.PORT, () => {
    console.log(`Voting service listening on ${process.env.PORT}`);
  });
}

// Kick things off
startServer();
