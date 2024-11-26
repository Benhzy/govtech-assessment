import express from 'express';
import agencies from '../constants/agencies';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ agencies });
});

export default router;
