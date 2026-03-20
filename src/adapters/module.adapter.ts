import type { ModuleModel } from '@/types/financial.types';

export function adaptModule(data: ModuleModel): ModuleModel { return data; }
export function adaptModuleList(data: ModuleModel[]): ModuleModel[] { return data.map(adaptModule); }
