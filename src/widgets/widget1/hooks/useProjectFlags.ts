import { useState, useCallback } from 'react';
import type { HostAPI } from '../../../../@types/globals';

type ProjectFlags = Record<string, boolean>;

interface UseProjectFlagsResult {
  projectFlags: ProjectFlags;
  loading: boolean;
  error: string | null;
  fetchProjectFlags: () => Promise<void>;
  updateProjectFlag: (projectId: string, enabled: boolean) => Promise<void>;
  toggleProjectFlag: (projectId: string) => void;
}

export const useProjectFlags = (host: HostAPI | null): UseProjectFlagsResult => {
  const [projectFlags, setProjectFlags] = useState<ProjectFlags>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjectFlags = useCallback(async (): Promise<void> => {
    if (!host) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const result = await host.fetchApp('backend/project-flags', {
        scope: false
      });

      if (result && typeof result === 'object' && 'flags' in result) {
        // @ts-expect-error - Runtime type check
        setProjectFlags(result.flags || {});
      } else {
        setProjectFlags({});
      }
    } catch {
      setError('Failed to load project flags');
      setProjectFlags({});
    } finally {
      setLoading(false);
    }
  }, [host]);

  const updateProjectFlag = useCallback(async (
    projectId: string, 
    enabled: boolean
  ): Promise<void> => {
    if (!host) {
      return;
    }

    try {
      await host.fetchApp('backend/project-flags', {
        scope: false,
        method: 'PUT',
        body: {
          projectId,
          enabled
        }
      });
    } catch (err) {
      // Revert the optimistic update
      setProjectFlags(prev => ({
        ...prev,
        [projectId]: !enabled
      }));
      throw err; // Re-throw to let caller handle
    }
  }, [host]);

  const toggleProjectFlag = useCallback((projectId: string): void => {
    setProjectFlags(prev => {
      const currentValue = !!prev[projectId];
      const newValue = !currentValue;

      // Optimistic update
      const updated = {
        ...prev,
        [projectId]: newValue
      };

      // Update backend (fire-and-forget with error handling)
      updateProjectFlag(projectId, newValue).catch(() => {
        // Error is handled by updateProjectFlag's catch block
      });

      return updated;
    });
  }, [updateProjectFlag]);

  return {
    projectFlags,
    loading,
    error,
    fetchProjectFlags,
    updateProjectFlag,
    toggleProjectFlag
  };
};