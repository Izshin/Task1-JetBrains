import React, { memo } from 'react';

const ICON_MAX_LENGTH = 3;

interface ProjectIconProps {
  shortName: string;
}

export const ProjectIcon = memo<ProjectIconProps>(({ shortName }) => {
  const iconText = shortName.substring(0, Math.min(ICON_MAX_LENGTH, shortName.length));

  return (
    <div className="project-icon">
      {iconText}
    </div>
  );
});

ProjectIcon.displayName = 'ProjectIcon';