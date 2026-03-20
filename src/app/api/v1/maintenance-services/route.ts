import { NextRequest, NextResponse } from 'next/server';
import { MaintenanceServiceService } from '@/services/maintenance-service.service';
import { adaptMaintenanceServiceList, adaptMaintenanceService } from '@/adapters/maintenance-service.adapter';
import { logger } from '@/lib/logger';
import { HttpError } from '@/lib/http-client';
import type { CreateMaintenanceServiceRequest } from '@/types/financial.types';

const service = new MaintenanceServiceService();

export async function GET(): Promise<NextResponse> {
  logger.info('[maintenance-services] GET list request received');

  try {
    const data    = await service.getAll();
    const adapted = adaptMaintenanceServiceList(data);

    logger.info('[maintenance-services] GET list completed', { total: adapted.length });

    return NextResponse.json(adapted);
  } catch (error) {
    return handleError(error, '[maintenance-services] GET list failed');
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = (await request.json()) as CreateMaintenanceServiceRequest;

  logger.info('[maintenance-services] POST request received', { description: body.description });

  try {
    const created = await service.create(body);
    const adapted = adaptMaintenanceService(created);

    logger.info('[maintenance-services] POST completed', { id: adapted.id });

    return NextResponse.json(adapted, { status: 201 });
  } catch (error) {
    return handleError(error, '[maintenance-services] POST failed');
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
