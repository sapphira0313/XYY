import { useState, useEffect } from 'react';
import type { Website, WebsiteGroup } from '../types/navigation';
import { upsertWebsite, deleteWebsite } from '../utils/supabaseStore';
import { GROUP_SECTIONS } from '../data/navigation';

interface WebsiteEditorProps {
  website: Website | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  groups?: WebsiteGroup[];
}

export function WebsiteEditor({ website, isOpen, onClose, onSave }: WebsiteEditorProps) {
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    icon: '',
    type: 'home',
  });

  useEffect(() => {
    if (website) {
      setFormData({
        name: website.name,
        url: website.url,
        icon: website.icon,
        type: website.type || 'home',
      });
    } else {
      setFormData({
        name: '',
        url: '',
        icon: '',
        type: 'home',
      });
    }
  }, [website, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.url) {
      alert('请填写网站名称和网址');
      return;
    }

    try {
      const hostname = new URL(formData.url).hostname;
      const websiteData = {
        id: website?.id || `site${Date.now()}`,
        name: formData.name,
        url: formData.url,
        icon: formData.icon || `https://${hostname}/favicon.ico`,
        position: website?.position || 0,
        type: formData.type,
        group_id: formData.type, // 使用分类 ID 作为 group_id
      };

      const success = await upsertWebsite(websiteData);
      if (success) {
        onSave();
        onClose();
      } else {
        alert('保存失败，请检查 Supabase 连接');
      }
    } catch (err) {
      console.error('网站数据处理失败:', err);
      alert('网站数据处理失败');
    }
  };

  const handleDelete = async () => {
    if (!website) return;
    
    if (confirm(`确定要删除 "${website.name}" 吗？`)) {
      const success = await deleteWebsite(website.id);
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
            {website ? '编辑网站' : '添加网站'}
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
              网站名称
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="例如：Google"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              网站地址
            </label>
            <input
              type="url"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="例如：https://www.google.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              图标地址
            </label>
            <input
              type="url"
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="留空自动获取 favicon"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              分类
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {GROUP_SECTIONS.map((section) => (
                <option key={section.id} value={section.id}>
                  {section.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            {website && (
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
