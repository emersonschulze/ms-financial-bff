import { NextRequest, NextResponse } from 'next/server';
import { AccountService } from '@/services/account.service';
import { adaptAccountList, adaptAccount } from '@/adapters/account.adapter';
import { logger } from '@/lib/logger';
import { HttpError } from '@/lib/http-client';
import type { CreateAccountRequest } from '@/types/financial.types';

const service = new AccountService();

export async function GET(): Promise<NextResponse> {
  logger.info('[accounts] GET list request received');

  try {
    const data    = await service.getAll();
    const adapted = adaptAccountList(data);

    logger.info('[accounts] GET list completed', { total: adapted.length });

    return NextResponse.json(adapted);
  } catch (error) {
    return handleError(error, '[accounts] GET list failed');
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = (await request.json()) as CreateAccountRequest;

  logger.info('[accounts] POST request received', { name: body.name });

  try {
    const created = await service.create(body);
    const adapted = adaptAccount(created);

    logger.info('[accounts] POST completed', { id: adapted.id });

    return NextResponse.json(adapted, { status: 201 });
  } catch (error) {
    return handleError(error, '[accounts] POST failed');
  }
}

function handleError(error: unknown, context: string): NextResponse {
  if (error instanceof HttpError) {
    logger.warn(context, { status: error.status, url: error.url });
    return NextResponse.json({ error: error.body }, { status: error.status });
  }

  logger.error(context, { error: String(error) });
  return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
}
