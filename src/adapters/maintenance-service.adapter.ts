import type { MaintenanceServiceModel } from '@/types/financial.types';

export function adaptMaintenanceService(data: MaintenanceServiceModel): MaintenanceServiceModel { return data; }
export function adaptMaintenanceServiceList(data: MaintenanceServiceModel[]): MaintenanceServiceModel[] { return data.map(adaptMaintenanceService); }
