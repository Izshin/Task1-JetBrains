import React, { memo } from 'react';
import Panel from '@jetbrains/ring-ui-built/components/panel/panel';
import Toggle from '@jetbrains/ring-ui-built/components/toggle/toggle';
import { Project } from '../../../../types/project.types';
import { ProjectIcon } from './ProjectIcon';
import { ProjectTitle } from './ProjectTitle';

interface ProjectCardProps {
  project: Project;
  enabled: boolean;
  onToggle: (projectId: string) => void;
}

export const ProjectCard = memo<ProjectCardProps>(({
  project,
  enabled,
  onToggle
}) => {
  const handleToggleChange = () => {
    onToggle(project.id);
  };

  return (
    <Panel className="project-card">
      <div className="project-card-content">
        <div className="project-header">
          <ProjectIcon shortName={project.shortName}/>
          <ProjectTitle name={project.name}/>
        </div>

        <div className="sync-control">
          <span className="sync-label">
            Concurrent Edit Prevention
          </span>

          <Toggle
            checked={enabled}
            disabled={false}
            onChange={handleToggleChange}
          />
        </div>
      </div>
    </Panel>
  );
});

ProjectCard.displayName = 'ProjectCard';