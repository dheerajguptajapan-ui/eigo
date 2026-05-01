import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_key_123';
const prisma = new PrismaClient();

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Authentication token required' });
  }

  // Accept mock tokens for development — format: "mock-token-{timestamp}"
  if (token.startsWith('mock-token-')) {
    // Read user info from x-mock-user header or fallback to a default test user
    const mockEmail = (req.headers['x-mock-email'] as string) || 'test@example.com';
    
    // Find or create the mock user in DB
    let user = await prisma.user.findUnique({ where: { email: mockEmail } });
    if (!user) {
      const bcrypt = await import('bcryptjs');
      user = await prisma.user.create({
        data: {
          email: mockEmail,
          password_hash: await bcrypt.hash('mock', 10),
          display_name: mockEmail.split('@')[0],
        },
      });
    }

    // Auto-seed SRS cards if user has none
    const cardCount = await prisma.userSRSCard.count({ where: { user_id: user.id } });
    if (cardCount === 0) {
      const vocabItems = await prisma.vocabularyItem.findMany({ take: 20 });
      if (vocabItems.length > 0) {
        await prisma.userSRSCard.createMany({
          data: vocabItems.map(item => ({
            user_id: user!.id,
            item_id: item.id,
            due_date: new Date(), // All due now for demo
          })),
        });
      }
    }

    req.user = { id: user.id, email: user.email };
    return next();
  }

  try {
    const user = jwt.verify(token, JWT_SECRET) as { id: string; email: string };
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};
