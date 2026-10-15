import React, { useState, useEffect, useMemo } from 'react';
import { Checkbox } from 'antd';
import {
  SafetyCertificateOutlined,
  CheckCircleFilled,
  AppstoreOutlined,
} from '@ant-design/icons';
import { useUserPermissionsQuery, useAssignPermissions } from '../../api/roles';
import { useI18n } from '../../i18n/I18nContext';
import {
  CustomButton,
  CustomDrawer,
  CustomSearchBar,
} from '../custom';
import { LoadingState } from '../common/LoadingState';
import type { Role, PermissionDto } from '../../types/role';

interface RolePermissionsDrawerProps {
  open: boolean;
  onClose: () => void;
  role: Role | null;
}

export const RolePermissionsDrawer: React.FC<RolePermissionsDrawerProps> = ({
  open,
  onClose,
  role,
}) => {
  const { t } = useI18n();
  const { data: permissionsData, isLoading } = useUserPermissionsQuery(undefined, open);
  const assignPermissions = useAssignPermissions();

  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  // Extract all permissions flattened with module metadata
  const allPermissions = useMemo(() => {
    if (!permissionsData?.result) return [];
    const list: Array<PermissionDto & { numericId: number }> = [];

    permissionsData.result.forEach((module, modIdx) => {
      module.subModuleDto?.forEach((subModule, subIdx) => {
        subModule.permissionDto?.forEach((perm, permIdx) => {
          const numericId = perm.id ?? (modIdx * 100 + subIdx * 10 + permIdx + 1);
          list.push({ ...perm, numericId });
        });
      });
    });

    return list;
  }, [permissionsData]);

  // Initialize selected permissions when drawer opens
  useEffect(() => {
    if (open && role && allPermissions.length > 0) {
      const initialSelected = new Set<number>();
      allPermissions.forEach((p) => {
        if (role.id === 1 || p.selected) {
          initialSelected.add(p.numericId);
        }
      });
      setSelectedIds(initialSelected);
    }
  }, [open, role, allPermissions]);

  const handleTogglePermission = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleToggleModule = (modulePermissions: Array<{ numericId: number }>, selectAll: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      modulePermissions.forEach((p) => {
        if (selectAll) {
          next.add(p.numericId);
        } else {
          next.delete(p.numericId);
        }
      });
      return next;
    });
  };

  const handleSave = async () => {
    if (!role) return;
    try {
      await assignPermissions.mutateAsync({
        role_id: role.id,
        permission_ids: Array.from(selectedIds),
      });
      onClose();
    } catch {
      // Handled by API error toast
    }
  };

  // Filter modules and permissions according to search query
  const filteredModules = useMemo(() => {
    if (!permissionsData?.result) return [];
    const query = searchQuery.trim().toLowerCase();

    return permissionsData.result
      .map((module, modIdx) => {
        const subModules = (module.subModuleDto || [])
          .map((sub, subIdx) => {
            const perms = (sub.permissionDto || [])
              .map((perm, permIdx) => ({
                ...perm,
                numericId: perm.id ?? (modIdx * 100 + subIdx * 10 + permIdx + 1),
              }))
              .filter((perm) => {
                if (!query) return true;
                return (
                  perm.name.toLowerCase().includes(query) ||
                  perm.screenName.toLowerCase().includes(query) ||
                  (perm.description && perm.description.toLowerCase().includes(query))
                );
              });

            return { ...sub, permissionDto: perms };
          })
          .filter((sub) => sub.permissionDto.length > 0);

        return { ...module, subModuleDto: subModules };
      })
      .filter((module) => module.subModuleDto.length > 0);
  }, [permissionsData, searchQuery]);

  return (
    <CustomDrawer
      open={open}
      onClose={onClose}
      width={700}
      titleText={
        <span className="flex items-center gap-2">
          <SafetyCertificateOutlined className="text-theme-accent" />
          <span>{t('roles.managePermissionsTitle')}</span>
        </span>
      }
      subtitleText={`${role?.name || ''} • ${role?.role_type || ''}`}
      footerContent={
        <div className="flex items-center justify-between w-full">
          <div className="text-xs font-semibold text-theme-muted">
            <span className="text-theme-accent font-bold">{selectedIds.size}</span> /{' '}
            {allPermissions.length} {t('roles.permissionsSelected')}
          </div>
          <div className="flex items-center gap-2.5">
            <CustomButton variant="secondary" size="md" onClick={onClose} disabled={assignPermissions.isPending}>
              {t('common.cancel')}
            </CustomButton>
            <CustomButton
              variant="primary"
              size="md"
              loading={assignPermissions.isPending}
              onClick={handleSave}
            >
              {t('roles.savePermissions')}
            </CustomButton>
          </div>
        </div>
      }
    >
      {isLoading ? (
        <div className="py-20 flex items-center justify-center">
          <LoadingState tip="Loading hierarchical permission matrix..." />
        </div>
      ) : (
        <div className="space-y-4">
          {/* Search & Overview Banner */}
          <div className="space-y-2.5">
            <CustomSearchBar
              placeholder={t('roles.searchPermissions')}
              value={searchQuery}
              onChange={setSearchQuery}
            />

            <div className="p-3 rounded-xl surface-card border border-theme-divider flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-theme-body font-medium">
                <CheckCircleFilled className="text-theme-active text-sm" />
                <span>
                  {t('roles.matrixInstructions')}
                </span>
              </div>
              <span className="badge-pill badge-pill-info">
                {selectedIds.size} Active
              </span>
            </div>
          </div>

          {/* Hierarchical Modules Accordion / Matrix */}
          <div className="space-y-4">
            {filteredModules.map((module) => {
              const modulePerms: Array<{ numericId: number }> = [];
              module.subModuleDto?.forEach((sub) => {
                sub.permissionDto?.forEach((p) => modulePerms.push(p));
              });

              const allModuleSelected =
                modulePerms.length > 0 && modulePerms.every((p) => selectedIds.has(p.numericId));
              const someModuleSelected =
                modulePerms.some((p) => selectedIds.has(p.numericId)) && !allModuleSelected;

              return (
                <div
                  key={module.uuid || module.name}
                  className="rounded-xl border border-theme-divider surface-card overflow-hidden shadow-xs"
                >
                  {/* Module Header with Bulk Select */}
                  <div className="px-4 py-3 bg-[var(--bg-surface-subtle)] border-b border-theme-divider flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <AppstoreOutlined className="text-theme-accent text-base" />
                      <div>
                        <span className="font-bold text-sm text-theme-title">
                          {module.name}
                        </span>
                        <p className="text-[11px] text-theme-muted m-0">
                          {module.description || `${module.name} security boundary`}
                        </p>
                      </div>
                    </div>

                    <Checkbox
                      checked={allModuleSelected}
                      indeterminate={someModuleSelected}
                      onChange={(e) => handleToggleModule(modulePerms, e.target.checked)}
                      className="text-xs font-semibold text-theme-title"
                    >
                      {t('roles.selectAll')}
                    </Checkbox>
                  </div>

                  {/* Submodules & Permission Grid */}
                  <div className="p-4 space-y-4">
                    {module.subModuleDto?.map((subModule) => (
                      <div key={subModule.uuid || subModule.name} className="space-y-2">
                        <span className="text-xs font-bold text-theme-muted uppercase tracking-wider">
                          {subModule.name}
                        </span>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {subModule.permissionDto?.map((perm) => {
                            const isChecked = selectedIds.has(perm.numericId);
                            return (
                              <div
                                key={perm.uuid || perm.name}
                                onClick={() => handleTogglePermission(perm.numericId)}
                                className={`p-3 rounded-lg border cursor-pointer transition-all flex items-start gap-3 select-none ${
                                  isChecked
                                    ? 'border-[var(--primary-500)] bg-[var(--primary-50)]'
                                    : 'border-theme-divider hover:border-[var(--border-strong)] bg-[var(--bg-surface)]'
                                }`}
                              >
                                <Checkbox
                                  checked={isChecked}
                                  onChange={() => handleTogglePermission(perm.numericId)}
                                  className="mt-0.5 pointer-events-none"
                                />
                                <div className="flex flex-col min-w-0">
                                  <span className="text-xs font-bold text-theme-title truncate">
                                    {perm.name}
                                  </span>
                                  <span className="text-[10px] text-theme-muted line-clamp-1">
                                    {perm.description || `${perm.screenName} (${perm.screenPath})`}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </CustomDrawer>
  );
};
