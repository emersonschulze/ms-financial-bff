import { NextResponse } from 'next/server';
import { TypeMaintenanceService } from '@/services/type-maintenance.service';
import { adaptTypeMaintenanceList } from '@/adapters/type-maintenance.adapter';
import { logger } from '@/lib/logger';
import { HttpError } from '@/lib/http-client';

const service = new TypeMaintenanceService();

export async function GET(): Promise<NextResponse> {
  logger.info('[type-maintenances] GET list request received');

  try {
    const data    = await service.getAll();
    const adapted = adaptTypeMaintenanceList(data);

    logger.info('[type-maintenances] GET list completed', { total: adapted.length });

    return NextResponse.json(adapted);
  } catch (error) {
    return handleError(error, '[type-maintenances] GET list failed');
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
