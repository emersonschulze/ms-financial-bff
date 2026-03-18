import { NextRequest, NextResponse } from 'next/server';
import { AccountService } from '@/services/account.service';
import { adaptAccount } from '@/adapters/account.adapter';
import { logger } from '@/lib/logger';
import { HttpError } from '@/lib/http-client';
import type { UpdateAccountRequest } from '@/types/financial.types';

const service = new AccountService();

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { id } = await params;

  logger.info('[accounts] GET by id request received', { id });

  try {
    const data    = await service.getById(id);
    const adapted = adaptAccount(data);

    logger.info('[accounts] GET by id completed', { id });

    return NextResponse.json(adapted);
  } catch (error) {
    return handleError(error, '[accounts] GET by id failed', id);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { id } = await params;
  const body   = (await request.json()) as UpdateAccountRequest;

  logger.info('[accounts] PUT request received', { id });

  try {
    const updated = await service.update(id, body);
    const adapted = adaptAccount(updated);

    logger.info('[accounts] PUT completed', { id });

    return NextResponse.json(adapted);
  } catch (error) {
    return handleError(error, '[accounts] PUT failed', id);
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { id } = await params;

  logger.info('[accounts] DELETE request received', { id });

  try {
    await service.delete(id);

    logger.info('[accounts] DELETE completed', { id });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return handleError(error, '[accounts] DELETE failed', id);
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
