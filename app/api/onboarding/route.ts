import { NextRequest } from 'next/server';
import { query } from '@/lib/db';

/**
 * @swagger
 * /api/onboarding:
 *   get:
 *     summary: Get all onboarding tasks
 *     description: Retrieve a list of all employee onboarding tasks
 *     responses:
 *       '200':
 *         description: A list of onboarding tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   task:
 *                     type: string
 *                   type:
 *                     type: string
 *                   document_name:
 *                     type: string
 *                     nullable: true
 *                   assigned_to:
 *                     type: string
 *                   name_of_employee:
 *                     type: string
 *                   due_date:
 *                     type: string
 *                     format: date
 *       '500':
 *         description: Internal server error
 */
export async function GET() {
  try {
    const result = await query('SELECT * FROM employee_onboarding ORDER BY due_date ASC');
    return new Response(JSON.stringify(result.rows), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching onboarding tasks:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch onboarding tasks' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

/**
 * @swagger
 * /api/onboarding:
 *   post:
 *     summary: Create a new onboarding task
 *     description: Create a new employee onboarding task
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - task
 *               - type
 *               - assigned_to
 *               - name_of_employee
 *               - due_date
 *             properties:
 *               task:
 *                 type: string
 *               type:
 *                 type: string
 *               document_name:
 *                 type: string
 *               assigned_to:
 *                 type: string
 *               name_of_employee:
 *                 type: string
 *               due_date:
 *                 type: string
 *                 format: date
 *     responses:
 *       '201':
 *         description: Created onboarding task
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 task:
 *                   type: string
 *                 type:
 *                   type: string
 *                 document_name:
 *                   type: string
 *                   nullable: true
 *                 assigned_to:
 *                   type: string
 *                 name_of_employee:
 *                   type: string
 *                 due_date:
 *                   type: string
 *                   format: date
 *       '400':
 *         description: Bad request
 *       '500':
 *         description: Internal server error
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { task, type, document_name, assigned_to, name_of_employee, due_date } = body;

    if (!task || !type || !assigned_to || !name_of_employee || !due_date) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const result = await query(
      `INSERT INTO employee_onboarding 
        (task, type, document_name, assigned_to, name_of_employee, due_date) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
      [task, type, document_name, assigned_to, name_of_employee, due_date]
    );

    return new Response(JSON.stringify(result.rows[0]), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error creating onboarding task:', error);
    return new Response(JSON.stringify({ error: 'Failed to create onboarding task' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}