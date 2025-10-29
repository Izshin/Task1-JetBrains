import React, { memo, useEffect } from 'react';
import { useYouTrackHost } from './hooks/useYouTrackHost';
import { useProjects } from './hooks/useProjects';
import { useProjectFlags } from './hooks/useProjectFlags';
import { ErrorMessage } from './components/ErrorMessage';
import { ProjectsGrid } from './components/ProjectsGrid';

const AppComponent: React.FunctionComponent = () => {
  const { host, hostError } = useYouTrackHost();
  const { projects, loading: projectsLoading, error: projectsError, fetchProjects } = useProjects(host);
  const { 
    projectFlags, 
    loading: flagsLoading, 
    error: flagsError, 
    fetchProjectFlags, 
    toggleProjectFlag 
  } = useProjectFlags(host);

  // Load data when host is ready
  useEffect(() => {
    if (!host) {
      return;
    }

    const loadData = async () => {
      await Promise.all([
        fetchProjects(),
        fetchProjectFlags()
      ]);
    };

    loadData();
  }, [host, fetchProjects, fetchProjectFlags]);

  // Handle errors
  const error = hostError || projectsError || flagsError;
  const loading = projectsLoading || flagsLoading;

  const handleRetry = () => {
    if (host) {
      fetchProjects();
      fetchProjectFlags();
    }
  };

  return (
    <div className="widget">
      {error && (
        <ErrorMessage 
          error={error} 
          onRetry={handleRetry} 
        />
      )}

      <div className="projects-list">
        <ProjectsGrid
          projects={projects}
          projectFlags={projectFlags}
          onToggleProject={toggleProjectFlag}
          loading={loading}
        />
      </div>
    </div>
  );
};

export const App = memo(AppComponent);