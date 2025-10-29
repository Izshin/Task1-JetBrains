import React, { memo } from 'react';
import LoaderInline from '@jetbrains/ring-ui-built/components/loader-inline/loader-inline';
import { ProjectCard } from './ProjectCard/ProjectCard';
import { Project } from '../../../types/project.types';

interface ProjectsGridProps {
  projects: Project[];
  projectFlags: Record<string, boolean>;
  onToggleProject: (projectId: string) => void;
  loading: boolean;
}

export const ProjectsGrid = memo<ProjectsGridProps>(({
  projects,
  projectFlags,
  onToggleProject,
  loading
}) => {
  if (loading) {
    return <LoaderInline/>;
  }

  if (projects.length === 0) {
    return (
      <div className="no-projects">
        No projects found
      </div>
    );
  }

  return (
    <div className="projects-grid">
      {projects.map(project => {
        const enabled = !!projectFlags[project.id];

        return (
          <ProjectCard
            key={project.id}
            project={project}
            enabled={enabled}
            onToggle={onToggleProject}
          />
        );
      })}
    </div>
  );
});

ProjectsGrid.displayName = 'ProjectsGrid';