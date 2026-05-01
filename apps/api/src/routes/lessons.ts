import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get all lessons (can be filtered by level and track)
router.get('/', async (req, res) => {
  try {
    const { level, track } = req.query;
    const where: any = {};
    if (level) where.level = level as string;
    if (track) where.track = track as string;

    const lessons = await prisma.lesson.findMany({
      where,
      include: {
        progress: {
          where: {
            user_id: (req as any).user?.id || ''
          }
        }
      }
    });

    res.json(lessons);
  } catch (error) {
    console.error('Error fetching lessons:', error);
    res.status(500).json({ error: 'Failed to fetch lessons' });
  }
});

// Get curriculum content for a specific level and track
router.get('/content', async (req, res) => {
  try {
    const { level, track } = req.query;
    if (!level || !track) {
      return res.status(400).json({ error: 'Level and track are required' });
    }

    let data;
    switch (track) {
      case 'vocabulary':
        data = await prisma.vocabularyItem.findMany({ where: { cefr_level: level as string } });
        break;
      case 'grammar':
        data = await prisma.grammarItem.findMany({ where: { level: level as string } });
        break;
      case 'reading':
        data = await prisma.readingPassage.findMany({ where: { level: level as string } });
        break;
      case 'listening':
        data = await prisma.listeningExercise.findMany({ where: { level: level as string } });
        break;
      default:
        return res.status(400).json({ error: 'Invalid track' });
    }

    res.json(data);
  } catch (error) {
    console.error('Error fetching curriculum content:', error);
    res.status(500).json({ error: 'Failed to fetch content' });
  }
});

// Get details of a specific lesson
router.get('/:id', async (req, res) => {
  try {
    const lesson = await prisma.lesson.findUnique({
      where: { id: req.params.id },
      include: {
        progress: {
          where: {
            user_id: (req as any).user?.id || ''
          }
        }
      }
    });

    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found' });
    }

    res.json(lesson);
  } catch (error) {
    console.error('Error fetching lesson:', error);
    res.status(500).json({ error: 'Failed to fetch lesson' });
  }
});

export default router;
