import { NextRequest } from 'next/server';
import { query } from '@/lib/db';

/**
 * @swagger
 * /api/payroll/{id}:
 *   get:
 *     summary: Get a specific payroll record
 *     description: Retrieve details of a specific employee payroll record by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The payroll record ID
 *     responses:
 *       '200':
 *         description: The payroll record
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 ssn:
 *                   type: string
 *                 address:
 *                   type: string
 *                 occupation:
 *                   type: string
 *                 gender:
 *                   type: string
 *                 hire_date:
 *                   type: string
 *                   format: date
 *                 salary:
 *                   type: number
 *                 regular_hourly_rate:
 *                   type: number
 *                   nullable: true
 *                 overtime_hourly_rate:
 *                   type: number
 *                   nullable: true
 *                 exempt_from_overtime:
 *                   type: boolean
 *                 federal_allowances:
 *                   type: integer
 *                 retirement_contribution:
 *                   type: number
 *                 insurance_deduction:
 *                   type: number
 *                 other_deductions:
 *                   type: number
 *       '404':
 *         description: Payroll record not found
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

    const result = await query('SELECT * FROM payroll WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return new Response(JSON.stringify({ error: 'Payroll record not found' }), {
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
    console.error('Error fetching payroll record:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch payroll record' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

/**
 * @swagger
 * /api/payroll/{id}:
 *   put:
 *     summary: Update a payroll record
 *     description: Update an existing employee payroll record by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The payroll record ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               ssn:
 *                 type: string
 *               address:
 *                 type: string
 *               occupation:
 *                 type: string
 *               gender:
 *                 type: string
 *               hire_date:
 *                 type: string
 *                 format: date
 *               salary:
 *                 type: number
 *               regular_hourly_rate:
 *                 type: number
 *               overtime_hourly_rate:
 *                 type: number
 *               exempt_from_overtime:
 *                 type: boolean
 *               federal_allowances:
 *                 type: integer
 *               retirement_contribution:
 *                 type: number
 *               insurance_deduction:
 *                 type: number
 *               other_deductions:
 *                 type: number
 *     responses:
 *       '200':
 *         description: Updated payroll record
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 ssn:
 *                   type: string
 *                 address:
 *                   type: string
 *                 occupation:
 *                   type: string
 *                 gender:
 *                   type: string
 *                 hire_date:
 *                   type: string
 *                   format: date
 *                 salary:
 *                   type: number
 *                 regular_hourly_rate:
 *                   type: number
 *                   nullable: true
 *                 overtime_hourly_rate:
 *                   type: number
 *                   nullable: true
 *                 exempt_from_overtime:
 *                   type: boolean
 *                 federal_allowances:
 *                   type: integer
 *                 retirement_contribution:
 *                   type: number
 *                 insurance_deduction:
 *                   type: number
 *                 other_deductions:
 *                   type: number
 *       '400':
 *         description: Bad request
 *       '404':
 *         description: Payroll record not found
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
    const { 
      name, 
      ssn, 
      address, 
      occupation, 
      gender, 
      hire_date, 
      salary,
      regular_hourly_rate,
      overtime_hourly_rate,
      exempt_from_overtime,
      federal_allowances,
      retirement_contribution,
      insurance_deduction,
      other_deductions
    } = body;

    const result = await query(
      `UPDATE payroll 
       SET name = $1, ssn = $2, address = $3, occupation = $4, gender = $5, hire_date = $6, 
           salary = $7, regular_hourly_rate = $8, overtime_hourly_rate = $9, 
           exempt_from_overtime = $10, federal_allowances = $11, retirement_contribution = $12, 
           insurance_deduction = $13, other_deductions = $14
       WHERE id = $15 
       RETURNING *`,
      [
        name, 
        ssn, 
        address, 
        occupation, 
        gender, 
        hire_date, 
        salary,
        regular_hourly_rate,
        overtime_hourly_rate,
        exempt_from_overtime,
        federal_allowances,
        retirement_contribution,
        insurance_deduction,
        other_deductions,
        id
      ]
    );

    if (result.rows.length === 0) {
      return new Response(JSON.stringify({ error: 'Payroll record not found' }), {
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
    console.error('Error updating payroll record:', error);
    return new Response(JSON.stringify({ error: 'Failed to update payroll record' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

/**
 * @swagger
 * /api/payroll/{id}:
 *   delete:
 *     summary: Delete a payroll record
 *     description: Delete an existing employee payroll record by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The payroll record ID
 *     responses:
 *       '204':
 *         description: Payroll record deleted successfully
 *       '400':
 *         description: Bad request
 *       '404':
 *         description: Payroll record not found
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

    const result = await query('DELETE FROM payroll WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return new Response(JSON.stringify({ error: 'Payroll record not found' }), {
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
    console.error('Error deleting payroll record:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete payroll record' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}