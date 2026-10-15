/**
 * TaskPulse Enterprise - Roles & Permissions Type Definitions
 * Directly corresponds to the FastAPI Backend Hierarchical DTO Contract
 */

export interface PermissionDto {
  id?: number;
  uuid: string;
  name: string;
  description: string | null;
  screenName: string;
  screenId: string;
  subModuleName: string;
  subModuleId: string;
  screenPath: string;
  moduleName: string;
  moduleId: string;
  selected: boolean;
  active: boolean;
  isDelete: boolean;
}

export interface SubModuleDto {
  uuid: string;
  name: string;
  description: string | null;
  moduleId: string;
  permissionDto: PermissionDto[];
}

export interface ModuleDto {
  uuid: string;
  name: string;
  description: string | null;
  active: boolean;
  isDelete: boolean;
  subModuleDto: SubModuleDto[];
}

export interface UserPermissionsData {
  message: string;
  status: boolean;
  statusCode: string;
  result: ModuleDto[];
  totalElements: number;
  noOfElements: number;
  noOfPages: number;
  currentStage: number;
}

export interface Role {
  id: number;
  name: string;
  description: string | null;
  role_type: string;
  is_active: boolean;
  is_delete: boolean;
  user_count: number;
  permission_count: number;
  created_at: string;
  updated_at: string;
}

export interface CreateRolePayload {
  name: string;
  description?: string | null;
  role_type?: string;
  is_active?: boolean;
  permission_ids?: number[];
}

export interface UpdateRolePayload {
  name?: string;
  description?: string | null;
  role_type?: string;
  is_active?: boolean;
}

export interface AssignPermissionsPayload {
  role_id: number;
  permission_ids: number[];
}

export interface RoleStatusPayload {
  is_active: boolean;
}
