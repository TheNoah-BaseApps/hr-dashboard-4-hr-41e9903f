import { NextRequest } from 'next/server';
import { query } from '@/lib/db';

/**
 * @swagger
 * /api/leave-attendance/{id}:
 *   get:
 *     summary: Get a specific leave record
 *     description: Retrieve details of a specific leave and attendance record by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The leave record ID
 *     responses:
 *       '200':
 *         description: The leave record
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
 *       '404':
 *         description: Leave record not found
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

    const result = await query('SELECT * FROM leave_attendance WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return new Response(JSON.stringify({ error: 'Leave record not found' }), {
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
    console.error('Error fetching leave record:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch leave record' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

/**
 * @swagger
 * /api/leave-attendance/{id}:
 *   put:
 *     summary: Update a leave record
 *     description: Update an existing leave and attendance record by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The leave record ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
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
 *       '200':
 *         description: Updated leave record
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
 *       '404':
 *         description: Leave record not found
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
    const { date, status, type, duration, assigned_to, comment } = body;

    const result = await query(
      `UPDATE leave_attendance 
       SET date = $1, status = $2, type = $3, duration = $4, assigned_to = $5, comment = $6 
       WHERE id = $7 
       RETURNING *`,
      [date, status, type, duration, assigned_to, comment, id]
    );

    if (result.rows.length === 0) {
      return new Response(JSON.stringify({ error: 'Leave record not found' }), {
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
    console.error('Error updating leave record:', error);
    return new Response(JSON.stringify({ error: 'Failed to update leave record' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

/**
 * @swagger
 * /api/leave-attendance/{id}:
 *   delete:
 *     summary: Delete a leave record
 *     description: Delete an existing leave and attendance record by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The leave record ID
 *     responses:
 *       '204':
 *         description: Leave record deleted successfully
 *       '400':
 *         description: Bad request
 *       '404':
 *         description: Leave record not found
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

    const result = await query('DELETE FROM leave_attendance WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return new Response(JSON.stringify({ error: 'Leave record not found' }), {
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
    console.error('Error deleting leave record:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete leave record' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}