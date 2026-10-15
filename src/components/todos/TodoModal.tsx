import React, { useEffect } from 'react';
import { Checkbox } from 'antd';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateTodo, useUpdateTodo } from '../../api/todos';
import { useI18n } from '../../i18n/I18nContext';
import {
  CustomModal,
  CustomInput,
  CustomTextarea,
  CustomButton,
} from '../custom';
import { todoSchema, type TodoFormData } from '@/schemas/todo';
import type { TodoItem } from '@/types/todo';

interface TodoModalProps {
  open: boolean;
  onClose: () => void;
  todoToEdit?: TodoItem | null;
}

export const TodoModal: React.FC<TodoModalProps> = ({ open, onClose, todoToEdit }) => {
  const { t } = useI18n();
  const createTodo = useCreateTodo();
  const updateTodo = useUpdateTodo();

  const isEditMode = Boolean(todoToEdit);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TodoFormData>({
    resolver: zodResolver(todoSchema),
    defaultValues: {
      title: '',
      description: '',
      is_complete: false,
    },
    mode: 'onChange',
  });

  useEffect(() => {
    if (open) {
      if (todoToEdit) {
        reset({
          title: todoToEdit.title,
          description: todoToEdit.description || '',
          is_complete: todoToEdit.is_complete,
        });
      } else {
        reset({
          title: '',
          description: '',
          is_complete: false,
        });
      }
    }
  }, [open, todoToEdit, reset]);

  const onSubmit = async (values: TodoFormData) => {
    try {
      if (isEditMode && todoToEdit) {
        await updateTodo.mutateAsync({
          id: todoToEdit.id,
          data: values,
        });
      } else {
        await createTodo.mutateAsync(values);
      }
      onClose();
    } catch {
      // Error handled by mutation toast
    }
  };

  const isSubmitting = createTodo.isPending || updateTodo.isPending;

  return (
    <CustomModal
      open={open}
      title={isEditMode ? t('tasks.editTask') : t('tasks.createTask')}
      onCancel={onClose}
      showFooter={false}
      destroyOnClose
      centered
      width={520}
      className="enterprise-modal"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4" noValidate>
        {/* Task Title */}
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <CustomInput
              label={t('tasks.taskTitle')}
              isRequired
              tooltip={t('tasks.taskTitleTooltip')}
              placeholder={t('tasks.taskTitlePlaceholder')}
              error={errors.title?.message}
              size="large"
              {...field}
            />
          )}
        />

        {/* Task Description */}
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <CustomTextarea
              label={t('tasks.taskDescription')}
              subLabel={t('tasks.optionalLabel')}
              tooltip={t('tasks.taskDescTooltip')}
              placeholder={t('tasks.taskDescPlaceholder')}
              error={errors.description?.message}
              rows={4}
              value={field.value || ''}
              onChange={field.onChange}
              onBlur={field.onBlur}
            />
          )}
        />

        {/* Task Status */}
        <div>
          <Controller
            name="is_complete"
            control={control}
            render={({ field }) => (
              <Checkbox
                checked={field.value}
                onChange={(e) => field.onChange(e.target.checked)}
                className="text-xs font-medium text-theme-body"
              >
                {t('tasks.taskStatus')}
              </Checkbox>
            )}
          />
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-2 pt-4 border-t border-theme-divider">
          <CustomButton variant="secondary" onClick={onClose} disabled={isSubmitting}>
            {t('common.cancel')}
          </CustomButton>
          <CustomButton
            type="submit"
            variant="primary"
            loading={isSubmitting}
          >
            {isEditMode ? t('tasks.saveChanges') : t('tasks.createButton')}
          </CustomButton>
        </div>
      </form>
    </CustomModal>
  );
};
