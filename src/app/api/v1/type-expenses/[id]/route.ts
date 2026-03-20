import { NextRequest, NextResponse } from 'next/server';
import { TypeExpenseService } from '@/services/type-expense.service';
import { adaptTypeExpense } from '@/adapters/type-expense.adapter';
import { logger } from '@/lib/logger';
import { HttpError } from '@/lib/http-client';
import type { UpdateTypeExpenseRequest } from '@/types/financial.types';

const service = new TypeExpenseService();

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { id } = await params;

  logger.info('[type-expenses] GET by id request received', { id });

  try {
    const data    = await service.getById(Number(id));
    const adapted = adaptTypeExpense(data);

    logger.info('[type-expenses] GET by id completed', { id });

    return NextResponse.json(adapted);
  } catch (error) {
    return handleError(error, '[type-expenses] GET by id failed', id);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { id } = await params;
  const body   = (await request.json()) as UpdateTypeExpenseRequest;

  logger.info('[type-expenses] PUT request received', { id });

  try {
    const updated = await service.update(Number(id), body);
    const adapted = adaptTypeExpense(updated);

    logger.info('[type-expenses] PUT completed', { id });

    return NextResponse.json(adapted);
  } catch (error) {
    return handleError(error, '[type-expenses] PUT failed', id);
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
