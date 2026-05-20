import { useEffect } from 'react';

interface UseKeyboardShortcutsOptions {
  onFocusSearch: () => void;
  onCloseSearchDropdown: () => void;
  onNextGroup: () => void;
  onPreviousGroup: () => void;
}

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tagName = target.tagName.toLowerCase();
  if (tagName === 'input' || tagName === 'textarea' || tagName === 'select') return true;
  if (target.isContentEditable) return true;
  return false;
}

export function useKeyboardShortcuts(options: UseKeyboardShortcutsOptions) {
  const { onFocusSearch, onCloseSearchDropdown, onNextGroup, onPreviousGroup } = options;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const editable = isEditableTarget(event.target);

      if (event.key === 'Escape') {
        onCloseSearchDropdown();
        return;
      }

      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        onFocusSearch();
        return;
      }

      if (!editable && event.key === '/') {
        event.preventDefault();
        onFocusSearch();
        return;
      }

      if (editable) return;

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        onNextGroup();
        return;
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault();
        onPreviousGroup();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onCloseSearchDropdown, onFocusSearch, onNextGroup, onPreviousGroup]);
}
