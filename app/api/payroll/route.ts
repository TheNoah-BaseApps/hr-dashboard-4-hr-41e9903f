import { NextRequest } from 'next/server';
import { query } from '@/lib/db';

/**
 * @swagger
 * /api/payroll:
 *   get:
 *     summary: Get all payroll records
 *     description: Retrieve a list of all employee payroll records
 *     responses:
 *       '200':
 *         description: A list of payroll records
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   ssn:
 *                     type: string
 *                   address:
 *                     type: string
 *                   occupation:
 *                     type: string
 *                   gender:
 *                     type: string
 *                   hire_date:
 *                     type: string
 *                     format: date
 *                   salary:
 *                     type: number
 *                   regular_hourly_rate:
 *                     type: number
 *                     nullable: true
 *                   overtime_hourly_rate:
 *                     type: number
 *                     nullable: true
 *                   exempt_from_overtime:
 *                     type: boolean
 *                   federal_allowances:
 *                     type: integer
 *                   retirement_contribution:
 *                     type: number
 *                   insurance_deduction:
 *                     type: number
 *                   other_deductions:
 *                     type: number
 *       '500':
 *         description: Internal server error
 */
export async function GET() {
  try {
    const result = await query('SELECT * FROM payroll ORDER BY name ASC');
    return new Response(JSON.stringify(result.rows), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching payroll records:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch payroll records' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

/**
 * @swagger
 * /api/payroll:
 *   post:
 *     summary: Create a new payroll record
 *     description: Create a new employee payroll record
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - ssn
 *               - address
 *               - occupation
 *               - gender
 *               - hire_date
 *               - salary
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
 *       '201':
 *         description: Created payroll record
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
 *       '500':
 *         description: Internal server error
 */
export async function POST(request: NextRequest) {
  try {
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

    if (!name || !ssn || !address || !occupation || !gender || !hire_date || salary === undefined) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const result = await query(
      `INSERT INTO payroll 
        (name, ssn, address, occupation, gender, hire_date, salary, regular_hourly_rate, 
         overtime_hourly_rate, exempt_from_overtime, federal_allowances, retirement_contribution, 
         insurance_deduction, other_deductions) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) 
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
        other_deductions
      ]
    );

    return new Response(JSON.stringify(result.rows[0]), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error creating payroll record:', error);
    return new Response(JSON.stringify({ error: 'Failed to create payroll record' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}