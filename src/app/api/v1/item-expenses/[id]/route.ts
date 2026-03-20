import { NextRequest, NextResponse } from 'next/server';
import { ItemExpenseService } from '@/services/item-expense.service';
import { adaptItemExpense } from '@/adapters/item-expense.adapter';
import { logger } from '@/lib/logger';
import { HttpError } from '@/lib/http-client';
import type { UpdateItemExpenseRequest } from '@/types/financial.types';

const service = new ItemExpenseService();

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { id } = await params;

  logger.info('[item-expenses] GET by id request received', { id });

  try {
    const data    = await service.getById(Number(id));
    const adapted = adaptItemExpense(data);

    logger.info('[item-expenses] GET by id completed', { id });

    return NextResponse.json(adapted);
  } catch (error) {
    return handleError(error, '[item-expenses] GET by id failed', id);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { id } = await params;
  const body   = (await request.json()) as UpdateItemExpenseRequest;

  logger.info('[item-expenses] PUT request received', { id });

  try {
    const updated = await service.update(Number(id), body);
    const adapted = adaptItemExpense(updated);

    logger.info('[item-expenses] PUT completed', { id });

    return NextResponse.json(adapted);
  } catch (error) {
    return handleError(error, '[item-expenses] PUT failed', id);
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { id } = await params;

  logger.info('[item-expenses] DELETE request received', { id });

  try {
    await service.delete(Number(id));

    logger.info('[item-expenses] DELETE completed', { id });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return handleError(error, '[item-expenses] DELETE failed', id);
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
