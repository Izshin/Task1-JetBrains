import React, { memo } from 'react';

const MAX_PROJECT_NAME_LENGTH = 60;

interface ProjectTitleProps {
  name: string;
}

export const ProjectTitle = memo<ProjectTitleProps>(({ name }) => {
  const displayName = name.length > MAX_PROJECT_NAME_LENGTH 
    ? `${name.substring(0, MAX_PROJECT_NAME_LENGTH)}...`
    : name;

  return (
    <h3 className="project-title">
      {displayName}
    </h3>
  );
});

ProjectTitle.displayName = 'ProjectTitle';