import express, {Response} from 'express';
import { body, validationResult, query } from 'express-validator';
import { getDatabase } from '../database/init';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';
import { Student, ApiResponse } from '../types';

const router = express.Router();

// Apply authentication middleware to all student routes
router.use(authenticateToken);

/**
 * GET /students
 * Get all students with optional subject filtering
 */
router.get('/', [
  query('subject').optional().isIn(['Math', 'Science', 'English', 'History'])
    .withMessage('Subject must be one of: Math, Science, English, History')
], async (req: AuthenticatedRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        error: 'Validation failed',
        data: errors.array()
      });
      return;
    }

    const db = getDatabase();
    const { subject } = req.query;
    
    let query = 'SELECT * FROM students ORDER BY created_at DESC';
    const params: any[] = [];
    
    if (subject) {
      query = 'SELECT * FROM students WHERE subject = ? ORDER BY created_at DESC';
      params.push(subject);
    }

    const students = await db.all(query, params);
    
    res.json({
      success: true,
      data: students,
      message: `Retrieved ${students.length} students`
    });
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve students'
    });
  }
});

/**
 * POST /students
 * Create a new student
 */
router.post('/', [
  body('name').isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('subject').isIn(['Math', 'Science', 'English', 'History'])
    .withMessage('Subject must be one of: Math, Science, English, History'),
  body('grade').isInt({ min: 0, max: 100 }).withMessage('Grade must be between 0 and 100')
], async (req: AuthenticatedRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        error: 'Validation failed',
        data: errors.array()
      });
      return;
    }

    const { name, email, subject, grade } = req.body;
    const db = getDatabase();

    const result = await db.run(
      'INSERT INTO students (name, email, subject, grade) VALUES (?, ?, ?, ?)',
      [name, email, subject, grade]
    );

    const newStudent = await db.get(
      'SELECT * FROM students WHERE id = ?',
      [result.lastID]
    );

    res.status(201).json({
      success: true,
      data: newStudent,
      message: 'Student created successfully'
    });
  } catch (error: unknown) {
    console.error('Create student error:', error);
    if (error instanceof Error && error.message.includes('UNIQUE constraint failed')) {
      res.status(409).json({
        success: false,
        error: 'Email already exists'
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Failed to create student'
      });
    }
  }
});

/**
 * PUT /students/:id
 * Update an existing student
 */
router.put('/:id', [
  body('name').optional().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').optional().isEmail().withMessage('Valid email is required'),
  body('subject').optional().isIn(['Math', 'Science', 'English', 'History'])
    .withMessage('Subject must be one of: Math, Science, English, History'),
  body('grade').optional().isInt({ min: 0, max: 100 }).withMessage('Grade must be between 0 and 100')
], async (req: AuthenticatedRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        error: 'Validation failed',
        data: errors.array()
      });
      return;
    }

    const { id } = req.params;
    const updates = req.body;
    const db = getDatabase();

    // Check if student exists
    const existingStudent = await db.get('SELECT * FROM students WHERE id = ?', [id]);
    if (!existingStudent) {
      res.status(404).json({
        success: false,
        error: 'Student not found'
      });
      return;
    }

    // Build dynamic update query
    const updateFields = Object.keys(updates);
    if (updateFields.length === 0) {
      res.status(400).json({
        success: false,
        error: 'No fields to update'
      });
      return;
    }

    const setClause = updateFields.map(field => `${field} = ?`).join(', ');
    const values = updateFields.map(field => updates[field]);
    values.push(id);

    await db.run(
      `UPDATE students SET ${setClause} WHERE id = ?`,
      values
    );

    const updatedStudent = await db.get('SELECT * FROM students WHERE id = ?', [id]);

    res.json({
      success: true,
      data: updatedStudent,
      message: 'Student updated successfully'
    });
  } catch (error) {
    console.error('Update student error:', error);
    if (error instanceof Error && error.message.includes('UNIQUE constraint failed')) {
      res.status(409).json({
        success: false,
        error: 'Email already exists'
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Failed to update student'
      });
    }
  }
});

/**
 * DELETE /students/:id
 * Delete a student
 */
router.delete('/:id', async (req: AuthenticatedRequest, res: express.Response<ApiResponse>) => {
  try {
    const { id } = req.params;
    const db = getDatabase();

    // Check if student exists
    const existingStudent = await db.get('SELECT * FROM students WHERE id = ?', [id]);
    if (!existingStudent) {
      res.status(404).json({
        success: false,
        error: 'Student not found'
      });
      return;
    }

    await db.run('DELETE FROM students WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Student deleted successfully'
    });
  } catch (error) {
    console.error('Delete student error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete student'
    });
  }
});

export default router;
