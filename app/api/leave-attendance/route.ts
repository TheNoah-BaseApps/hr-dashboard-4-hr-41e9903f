import { NextRequest } from 'next/server';
import { query } from '@/lib/db';

/**
 * @swagger
 * /api/leave-attendance:
 *   get:
 *     summary: Get all leave and attendance records
 *     description: Retrieve a list of all leave and attendance records
 *     responses:
 *       '200':
 *         description: A list of leave and attendance records
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   date:
 *                     type: string
 *                     format: date
 *                   status:
 *                     type: string
 *                   type:
 *                     type: string
 *                   duration:
 *                     type: number
 *                   assigned_to:
 *                     type: string
 *                   comment:
 *                     type: string
 *                     nullable: true
 *       '500':
 *         description: Internal server error
 */
export async function GET() {
  try {
    const result = await query('SELECT * FROM leave_attendance ORDER BY date DESC');
    return new Response(JSON.stringify(result.rows), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching leave records:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch leave records' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

/**
 * @swagger
 * /api/leave-attendance:
 *   post:
 *     summary: Create a new leave request
 *     description: Create a new leave and attendance record
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - date
 *               - status
 *               - type
 *               - duration
 *               - assigned_to
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *               status:
 *                 type: string
 *               type:
 *                 type: string
 *               duration:
 *                 type: number
 *               assigned_to:
 *                 type: string
 *               comment:
 *                 type: string
 *     responses:
 *       '201':
 *         description: Created leave record
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 date:
 *                   type: string
 *                   format: date
 *                 status:
 *                   type: string
 *                 type:
 *                   type: string
 *                 duration:
 *                   type: number
 *                 assigned_to:
 *                   type: string
 *                 comment:
 *                   type: string
 *                   nullable: true
 *       '400':
 *         description: Bad request
 *       '500':
 *         description: Internal server error
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { date, status, type, duration, assigned_to, comment } = body;

    if (!date || !status || !type || !duration || !assigned_to) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const result = await query(
      `INSERT INTO leave_attendance 
        (date, status, type, duration, assigned_to, comment) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
      [date, status, type, duration, assigned_to, comment]
    );

    return new Response(JSON.stringify(result.rows[0]), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error creating leave record:', error);
    return new Response(JSON.stringify({ error: 'Failed to create leave record' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}