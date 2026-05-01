import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { calculateNextSRSState } from '../services/srsService';
import { AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Get due cards for a user
router.get('/due', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const dueCards = await prisma.userSRSCard.findMany({
      where: {
        user_id: userId,
        due_date: {
          lte: new Date(),
        },
      },
      include: {
        vocabulary_item: true,
      },
      orderBy: {
        due_date: 'asc',
      },
      take: 50,
    });

    res.json(dueCards);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Record a review
router.post('/review', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { cardId, rating } = req.body;

    if (!cardId || !rating) {
      res.status(400).json({ error: 'Missing cardId or rating' });
      return;
    }

    const card = await prisma.userSRSCard.findUnique({
      where: { id: cardId },
    });

    if (!card || card.user_id !== req.user?.id) {
      res.status(404).json({ error: 'Card not found or access denied' });
      return;
    }

    const nextState = calculateNextSRSState(rating, {
      interval_days: card.interval_days,
      ease_factor: card.ease_factor,
      review_count: card.review_count,
      due_date: card.due_date,
    });

    const updatedCard = await prisma.userSRSCard.update({
      where: { id: cardId },
      data: {
        interval_days: nextState.interval_days,
        ease_factor: nextState.ease_factor,
        review_count: nextState.review_count,
        due_date: nextState.due_date,
        last_reviewed_at: new Date(),
      },
    });

    res.json(updatedCard);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
