import type { TypeMaintenanceModel } from '@/types/financial.types';

export function adaptTypeMaintenance(data: TypeMaintenanceModel): TypeMaintenanceModel { return data; }
export function adaptTypeMaintenanceList(data: TypeMaintenanceModel[]): TypeMaintenanceModel[] { return data.map(adaptTypeMaintenance); }
