import { NextRequest } from 'next/server';
import { query } from '@/lib/db';

/**
 * @swagger
 * /api/onboarding/{id}:
 *   get:
 *     summary: Get a specific onboarding task
 *     description: Retrieve details of a specific employee onboarding task by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The onboarding task ID
 *     responses:
 *       '200':
 *         description: The onboarding task
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
 *       '404':
 *         description: Onboarding task not found
 *       '500':
 *         description: Internal server error
 */
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return new Response(JSON.stringify({ error: 'Invalid ID' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const result = await query('SELECT * FROM employee_onboarding WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return new Response(JSON.stringify({ error: 'Onboarding task not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    return new Response(JSON.stringify(result.rows[0]), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching onboarding task:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch onboarding task' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

/**
 * @swagger
 * /api/onboarding/{id}:
 *   put:
 *     summary: Update an onboarding task
 *     description: Update an existing employee onboarding task by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The onboarding task ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
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
 *       '200':
 *         description: Updated onboarding task
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
 *       '404':
 *         description: Onboarding task not found
 *       '500':
 *         description: Internal server error
 */
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return new Response(JSON.stringify({ error: 'Invalid ID' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const body = await request.json();
    const { task, type, document_name, assigned_to, name_of_employee, due_date } = body;

    const result = await query(
      `UPDATE employee_onboarding 
       SET task = $1, type = $2, document_name = $3, assigned_to = $4, name_of_employee = $5, due_date = $6 
       WHERE id = $7 
       RETURNING *`,
      [task, type, document_name, assigned_to, name_of_employee, due_date, id]
    );

    if (result.rows.length === 0) {
      return new Response(JSON.stringify({ error: 'Onboarding task not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    return new Response(JSON.stringify(result.rows[0]), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error updating onboarding task:', error);
    return new Response(JSON.stringify({ error: 'Failed to update onboarding task' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

/**
 * @swagger
 * /api/onboarding/{id}:
 *   delete:
 *     summary: Delete an onboarding task
 *     description: Delete an existing employee onboarding task by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The onboarding task ID
 *     responses:
 *       '204':
 *         description: Onboarding task deleted successfully
 *       '400':
 *         description: Bad request
 *       '404':
 *         description: Onboarding task not found
 *       '500':
 *         description: Internal server error
 */
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return new Response(JSON.stringify({ error: 'Invalid ID' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const result = await query('DELETE FROM employee_onboarding WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return new Response(JSON.stringify({ error: 'Onboarding task not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    return new Response(null, {
      status: 204,
    });
  } catch (error) {
    console.error('Error deleting onboarding task:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete onboarding task' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}