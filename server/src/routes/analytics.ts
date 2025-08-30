import express from 'express';
import { getDatabase } from '../database/init';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';
import { Analytics, ApiResponse } from '../types';

const router = express.Router();

router.use(authenticateToken);

/**
 * GET /analytics
 * Get dashboard analytics including total count, average by subject, and recent additions
 */
router.get('/', async (req: AuthenticatedRequest, res: express.Response<ApiResponse<Analytics>>) => {
  try {
    const db = getDatabase();

    // Get total student count
    const totalResult = await db.get('SELECT COUNT(*) as count FROM students');
    const totalStudents = totalResult.count;

    // Get average grade by subject
    const averageBySubject = await db.all(`
      SELECT subject, AVG(grade) as average 
      FROM students 
      GROUP BY subject
    `);
    
    const averageGradeBySubject: { [subject: string]: number } = {};
    averageBySubject.forEach(row => {
      averageGradeBySubject[row.subject] = Math.round(row.average * 100) / 100;
    });

    // Get recent additions (last 10 students)
    const rawRecentAdditions = await db.all(`
      SELECT * FROM students 
      ORDER BY created_at DESC 
      LIMIT 10
    `);
    
    const recentAdditions = rawRecentAdditions;

    const analytics: Analytics = {
      totalStudents,
      averageGradeBySubject,
      recentAdditions
    };

    res.json({
      success: true,
      data: analytics,
      message: 'Analytics retrieved successfully'
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve analytics'
    });
  }
});

export default router;
