import { NextResponse } from 'next/server';
import { ModuleService } from '@/services/module.service';
import { adaptModuleList } from '@/adapters/module.adapter';
import { logger } from '@/lib/logger';
import { HttpError } from '@/lib/http-client';

const service = new ModuleService();

export async function GET(): Promise<NextResponse> {
  logger.info('[modules] GET list request received');

  try {
    const data    = await service.getAll();
    const adapted = adaptModuleList(data);

    logger.info('[modules] GET list completed', { total: adapted.length });

    return NextResponse.json(adapted);
  } catch (error) {
    return handleError(error, '[modules] GET list failed');
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
