import { NextRequest, NextResponse } from 'next/server';
import { MaintenanceServiceService } from '@/services/maintenance-service.service';
import { adaptMaintenanceService } from '@/adapters/maintenance-service.adapter';
import { logger } from '@/lib/logger';
import { HttpError } from '@/lib/http-client';

const service = new MaintenanceServiceService();

export async function PATCH(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { id } = await params;

  logger.info('[maintenance-services] PATCH inactivate request received', { id });

  try {
    const updated = await service.inactivate(Number(id));
    const adapted = adaptMaintenanceService(updated);

    logger.info('[maintenance-services] PATCH inactivate completed', { id });

    return NextResponse.json(adapted);
  } catch (error) {
    return handleError(error, '[maintenance-services] PATCH inactivate failed', id);
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
