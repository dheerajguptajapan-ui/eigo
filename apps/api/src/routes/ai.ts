import { Router, Response } from 'express';
import { SCENARIOS, processChatMessage } from '../services/aiService';
import { AuthRequest } from '../middleware/auth';

const router = Router();

// Get available scenarios
router.get('/scenarios', (req: AuthRequest, res: Response) => {
  res.json(SCENARIOS);
});

// Process a chat message
router.post('/chat', async (req: AuthRequest, res: Response) => {
  const { scenarioId, messages } = req.body;

  if (!scenarioId || !messages || !Array.isArray(messages)) {
    res.status(400).json({ error: 'Missing scenarioId or messages' });
    return;
  }

  const response = await processChatMessage(scenarioId, messages);
  res.json(response);
});

export default router;
