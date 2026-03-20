import { NextRequest, NextResponse } from 'next/server';
import { MaintenanceServiceService } from '@/services/maintenance-service.service';
import { adaptMaintenanceService } from '@/adapters/maintenance-service.adapter';
import { logger } from '@/lib/logger';
import { HttpError } from '@/lib/http-client';
import type { UpdateMaintenanceServiceRequest } from '@/types/financial.types';

const service = new MaintenanceServiceService();

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { id } = await params;

  logger.info('[maintenance-services] GET by id request received', { id });

  try {
    const data    = await service.getById(Number(id));
    const adapted = adaptMaintenanceService(data);

    logger.info('[maintenance-services] GET by id completed', { id });

    return NextResponse.json(adapted);
  } catch (error) {
    return handleError(error, '[maintenance-services] GET by id failed', id);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { id } = await params;
  const body   = (await request.json()) as UpdateMaintenanceServiceRequest;

  logger.info('[maintenance-services] PUT request received', { id });

  try {
    const updated = await service.update(Number(id), body);
    const adapted = adaptMaintenanceService(updated);

    logger.info('[maintenance-services] PUT completed', { id });

    return NextResponse.json(adapted);
  } catch (error) {
    return handleError(error, '[maintenance-services] PUT failed', id);
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
