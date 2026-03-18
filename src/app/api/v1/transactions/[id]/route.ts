import { NextRequest, NextResponse } from 'next/server';
import { TransactionService } from '@/services/transaction.service';
import { adaptTransaction } from '@/adapters/transaction.adapter';
import { logger } from '@/lib/logger';
import { HttpError } from '@/lib/http-client';
import type { UpdateTransactionRequest } from '@/types/financial.types';

const service = new TransactionService();

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { id } = await params;

  logger.info('[transactions] GET by id request received', { id });

  try {
    const data    = await service.getById(id);
    const adapted = adaptTransaction(data);

    logger.info('[transactions] GET by id completed', { id });

    return NextResponse.json(adapted);
  } catch (error) {
    return handleError(error, '[transactions] GET by id failed', id);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { id } = await params;
  const body   = (await request.json()) as UpdateTransactionRequest;

  logger.info('[transactions] PUT request received', { id });

  try {
    const updated = await service.update(id, body);
    const adapted = adaptTransaction(updated);

    logger.info('[transactions] PUT completed', { id });

    return NextResponse.json(adapted);
  } catch (error) {
    return handleError(error, '[transactions] PUT failed', id);
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { id } = await params;

  logger.info('[transactions] DELETE request received', { id });

  try {
    await service.delete(id);

    logger.info('[transactions] DELETE completed', { id });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return handleError(error, '[transactions] DELETE failed', id);
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
