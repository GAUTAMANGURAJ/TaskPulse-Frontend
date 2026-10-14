import React, { useEffect } from 'react';
import { Modal, Form, Input, Checkbox, Button } from 'antd';
import { useCreateTodo, useUpdateTodo } from '../../api/todos';
import type { TodoItem, TodoCreatePayload } from '@/types/todo';

interface TodoModalProps {
  open: boolean;
  onClose: () => void;
  todoToEdit?: TodoItem | null;
}

export const TodoModal: React.FC<TodoModalProps> = ({ open, onClose, todoToEdit }) => {
  const [form] = Form.useForm<TodoCreatePayload>();
  const createTodo = useCreateTodo();
  const updateTodo = useUpdateTodo();

  const isEditMode = Boolean(todoToEdit);

  useEffect(() => {
    if (open) {
      if (todoToEdit) {
        form.setFieldsValue({
          title: todoToEdit.title,
          description: todoToEdit.description || '',
          is_complete: todoToEdit.is_complete,
        });
      } else {
        form.resetFields();
        form.setFieldsValue({
          is_complete: false,
        });
      }
    }
  }, [open, todoToEdit, form]);

  const handleSubmit = async (values: TodoCreatePayload) => {
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
    <Modal
      open={open}
      title={
        <div className="text-lg font-bold text-slate-800 dark:text-slate-100">
          {isEditMode ? 'Edit Task Details' : 'Create New Enterprise Task'}
        </div>
      }
      onCancel={onClose}
      footer={null}
      destroyOnClose
      centered
      width={520}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="mt-4"
        requiredMark={false}
      >
        <Form.Item
          name="title"
          label={<span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Task Title</span>}
          rules={[
            { required: true, message: 'Task title is required' },
            { max: 255, message: 'Title cannot exceed 255 characters' },
          ]}
        >
          <Input
            placeholder="e.g. Conduct Q3 compliance audit"
            size="large"
            className="rounded-lg"
          />
        </Form.Item>

        <Form.Item
          name="description"
          label={<span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Description (Optional)</span>}
          rules={[{ max: 1000, message: 'Description cannot exceed 1000 characters' }]}
        >
          <Input.TextArea
            rows={4}
            placeholder="Provide relevant context, deliverable guidelines, or requirements..."
            className="rounded-lg"
          />
        </Form.Item>

        <Form.Item name="is_complete" valuePropName="checked" className="mb-6">
          <Checkbox className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Mark task as completed
          </Checkbox>
        </Form.Item>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
          <Button onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={isSubmitting}
            className="bg-indigo-600 hover:bg-indigo-700 font-semibold"
          >
            {isEditMode ? 'Save Changes' : 'Create Task'}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};
