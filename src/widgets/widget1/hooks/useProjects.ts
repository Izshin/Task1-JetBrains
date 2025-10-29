import { useState, useCallback } from 'react';
import type { HostAPI } from '../../../../@types/globals';
import { Project } from '../../../types/project.types';

const PROJECT_QUERY_FIELDS = 'id,name,shortName,description,createdBy(login,name,id),leader(login,name,id)';
const DEFAULT_PROJECT_LIMIT = 20;

interface UseProjectsResult {
  projects: Project[];
  loading: boolean;
  error: string | null;
  fetchProjects: () => Promise<void>;
  refetch: () => Promise<void>;
}

export const useProjects = (host: HostAPI | null): UseProjectsResult => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async (): Promise<void> => {
    if (!host) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const result = await host.fetchYouTrack('admin/projects', {
        query: {
          fields: PROJECT_QUERY_FIELDS,
          '$top': DEFAULT_PROJECT_LIMIT
        }
      });

      const projectsArray = Array.isArray(result) ? result : [];
      setProjects(projectsArray as Project[]);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(`Failed to load projects: ${errorMessage}`);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, [host]);

  const refetch = useCallback(async (): Promise<void> => {
    await fetchProjects();
  }, [fetchProjects]);

  return {
    projects,
    loading,
    error,
    fetchProjects,
    refetch
  };
};