import express, { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import axios from 'axios';
import { Pool } from 'pg';
import { getContract } from './fabric';

const app = express();
app.use(express.json());

const pool = new Pool({ connectionString: process.env.PG_CONN });

// 1) JWT middleware
app.use(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const authHeader = req.header('Authorization');
      const token = authHeader?.split(' ')[1];
      if (!token) {
        res.status(401).send('Missing token');
        return;                // <-- just return void, not `return res…`
      }
      try {
        const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
        (req as any).user = payload;
        next();
      } catch (err) {
        res.status(401).send('Invalid token');
        return;
      }
    }
  );

// 2) Identity check middleware
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

// 3) POST /vote
app.post(
  '/vote',
  async (req: Request, res: Response) => {
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
  }
);

// 4) GET /results
app.get(
  '/results',
  async (_req: Request, res: Response) => {
    const { rows } = await pool.query(
      `SELECT candidate, COUNT(*) AS count FROM votes GROUP BY candidate`
    );
    res.send(rows);
  }
);

app.listen(process.env.PORT, () => {
  console.log(`Voting service listening on ${process.env.PORT}`);
});
