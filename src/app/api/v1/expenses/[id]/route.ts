import { NextRequest, NextResponse } from 'next/server';
import { ExpenseService } from '@/services/expense.service';
import { adaptExpense } from '@/adapters/expense.adapter';
import { logger } from '@/lib/logger';
import { HttpError } from '@/lib/http-client';
import type { UpdateExpenseRequest } from '@/types/financial.types';

const service = new ExpenseService();

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { id } = await params;

  logger.info('[expenses] GET by id request received', { id });

  try {
    const data    = await service.getById(Number(id));
    const adapted = adaptExpense(data);

    logger.info('[expenses] GET by id completed', { id });

    return NextResponse.json(adapted);
  } catch (error) {
    return handleError(error, '[expenses] GET by id failed', id);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { id } = await params;
  const body   = (await request.json()) as UpdateExpenseRequest;

  logger.info('[expenses] PUT request received', { id });

  try {
    const updated = await service.update(Number(id), body);
    const adapted = adaptExpense(updated);

    logger.info('[expenses] PUT completed', { id });

    return NextResponse.json(adapted);
  } catch (error) {
    return handleError(error, '[expenses] PUT failed', id);
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { id } = await params;

  logger.info('[expenses] DELETE request received', { id });

  try {
    await service.delete(Number(id));

    logger.info('[expenses] DELETE completed', { id });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return handleError(error, '[expenses] DELETE failed', id);
  }
}

function handleError(error: unknown, context: string, id?: string): NextResponse {
  if (error instanceof HttpError) {
    logger.warn(context, { status: error.status, id });
    return NextResponse.json({ error: error.body }, { status: error.status });
  }

  logger.error(context, { error: String(error), id });
  return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
}
