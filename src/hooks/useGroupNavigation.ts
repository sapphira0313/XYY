import { useCallback, useEffect, useRef, useState } from 'react';

import type { WebsiteGroup } from '../types/navigation';

const GROUP_TRANSITION_MS = 150;
const WHEEL_THROTTLE_MS = 300;

export function useGroupNavigation(websiteGroups: WebsiteGroup[], activeGroupId: string, setActiveGroupId: (groupId: string) => void) {
  const [groupAnimation, setGroupAnimation] = useState<'fade-in' | 'fade-out'>('fade-in');
  const mainContentRef = useRef<HTMLDivElement>(null);
  const groupTransitionTimeoutRef = useRef<number | null>(null);
  const lastWheelAtRef = useRef<number>(0);

  const switchGroup = useCallback((nextGroupId: string) => {
    if (!nextGroupId || nextGroupId === activeGroupId) {
      return;
    }

    if (groupTransitionTimeoutRef.current !== null) {
      window.clearTimeout(groupTransitionTimeoutRef.current);
    }

    setGroupAnimation('fade-out');
    groupTransitionTimeoutRef.current = window.setTimeout(() => {
      setActiveGroupId(nextGroupId);
      setGroupAnimation('fade-in');
      groupTransitionTimeoutRef.current = null;
    }, GROUP_TRANSITION_MS);
  }, [activeGroupId, setActiveGroupId]);

  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      const content = mainContentRef.current;
      if (!content || !content.contains(event.target as Node) || websiteGroups.length === 0) {
        return;
      }

      const now = Date.now();
      if (now - lastWheelAtRef.current < WHEEL_THROTTLE_MS) {
        event.preventDefault();
        return;
      }
      lastWheelAtRef.current = now;

      event.preventDefault();

      const currentIndex = websiteGroups.findIndex((group) => group.id === activeGroupId);
      if (currentIndex < 0) {
        return;
      }

      const delta = event.deltaY > 0 ? 1 : -1;
      const nextIndex = (currentIndex + delta + websiteGroups.length) % websiteGroups.length;
      switchGroup(websiteGroups[nextIndex].id);
    };

    document.addEventListener('wheel', handleWheel, { passive: false });
    return () => document.removeEventListener('wheel', handleWheel);
  }, [activeGroupId, switchGroup, websiteGroups]);

  useEffect(() => {
    return () => {
      if (groupTransitionTimeoutRef.current !== null) {
        window.clearTimeout(groupTransitionTimeoutRef.current);
      }
    };
  }, []);

  return {
    groupAnimation,
    mainContentRef,
    switchGroup,
  };
}
