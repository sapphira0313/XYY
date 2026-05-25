import { useState, useEffect } from 'react';
import type { GroupData } from '../lib/supabase';
import { upsertGroup, deleteGroup } from '../utils/supabaseStore';

interface GroupEditorProps {
  group: GroupData | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export function GroupEditor({ group, isOpen, onClose, onSave }: GroupEditorProps) {
  const [formData, setFormData] = useState({
    name: '',
    position: 0,
  });

  useEffect(() => {
    if (group) {
      setFormData({
        name: group.name,
        position: group.position,
      });
    } else {
      setFormData({
        name: '',
        position: 0,
      });
    }
  }, [group, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name) {
      alert('请填写分组名称');
      return;
    }

    const groupData = {
      id: group?.id || `group${Date.now()}`,
      name: formData.name,
      position: formData.position,
    };

    const success = await upsertGroup(groupData);
    if (success) {
      onSave();
      onClose();
    } else {
      alert('保存失败');
    }
  };

  const handleDelete = async () => {
    if (!group) return;
    
    if (confirm(`确定要删除分组 "${group.name}" 吗？`)) {
      const success = await deleteGroup(group.id);
      if (success) {
        onSave();
        onClose();
      } else {
        alert('删除失败');
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">
            {group ? '编辑分组' : '添加分组'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            ✕
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              分组名称
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="例如：我的收藏"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              排序位置
            </label>
            <input
              type="number"
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0"
            />
          </div>

          <div className="flex gap-3 pt-4">
            {group && (
              <button
                type="button"
                onClick={handleDelete}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                删除
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
