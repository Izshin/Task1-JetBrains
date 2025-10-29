import React, {memo, useCallback, useEffect, useState} from 'react';
import Button from '@jetbrains/ring-ui-built/components/button/button';
import LoaderInline from '@jetbrains/ring-ui-built/components/loader-inline/loader-inline';
import Panel from '@jetbrains/ring-ui-built/components/panel/panel';
import Toggle from '@jetbrains/ring-ui-built/components/toggle/toggle';
import {Project} from '../../types/project.types';
import type {HostAPI} from '../../../@types/globals';

const ICON_MAX_LENGTH = 3;
const MAX_PROJECT_NAME_LENGTH = 60;

const AppComponent: React.FunctionComponent = () => {
  const [host, setHost] = useState<HostAPI | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 1. Register the widget with YouTrack host once
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const registeredHost = await YTApp.register();
        if (mounted) {
          setHost(registeredHost);
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('❌ Failed to register YTApp host:', e);
        if (mounted) {
          setError('Failed to initialize host');
          setLoading(false);
        }
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);



  const logDebugInfo = useCallback((result: unknown) => {
    // eslint-disable-next-line no-console
    console.log('✅ YouTrack response received:', result);
    // eslint-disable-next-line no-console
    console.log('📊 Response type:', typeof result);
    // eslint-disable-next-line no-console
    console.log('📋 Response keys:', result ? Object.keys(result) : 'null/undefined');
    // eslint-disable-next-line no-console
    console.log('🔍 Is array?', Array.isArray(result));
    // eslint-disable-next-line no-console
    console.log('📏 Array length:', Array.isArray(result) ? result.length : 'not an array');
  }, []);

  // 2. Fetch projects directly from YouTrack REST using host.fetchYouTrack
  const fetchProjects = useCallback(async () => {
    if (!host) {
        // host not ready yet, don't run
        return;
    }
    try {
      setLoading(true);
      setError(null);

      // eslint-disable-next-line no-console
      console.log('🚀 Starting fetchYouTrack request to admin/projects');

      const result = await host.fetchYouTrack(
        'admin/projects',
        {
          query: {
            fields:
              'id,name,shortName,description,createdBy(login,name,id),leader(login,name,id)',
            '$top': 20
          }
        }
      );

      logDebugInfo(result);

      // We expect an array of project objects
      const projectsArray = Array.isArray(result) ? result : [];
      // eslint-disable-next-line no-console
      console.log('🎯 Setting projects array:', projectsArray);

      setProjects(projectsArray as Project[]);
    } catch (err: unknown) {
      // eslint-disable-next-line no-console
      console.error('❌ Failed to fetch projects - Full error:', err);

      setError(
        `Failed to load projects: ${err instanceof Error ? err.message : 'Unknown error'}`
      );
    } finally {
      setLoading(false);
    }
  }, [host, logDebugInfo]);



  // 3. Kick off fetch once host is ready
  useEffect(() => {
    if (host) {
      fetchProjects();
    }
  }, [host, fetchProjects]);



  return (
    <div className="widget">
      {error && (
        <div className="error-message">
          {error}
          <Button onClick={fetchProjects}>Retry</Button>
        </div>
      )}

      {loading ? (
        <LoaderInline/>
      ) : (
        <div className="projects-list">
          {projects.length === 0 ? (
            <div className="no-projects">No projects found</div>
          ) : (
            <div className="projects-grid">
              {projects.map(project => (
                <Panel key={project.id} className="project-card">
                  <div className="project-card-content">
                    <div className="project-header">
                      <div className="project-icon">
                        {project.shortName.substring(0, Math.min(ICON_MAX_LENGTH, project.shortName.length))}
                      </div>

                      <h3 className="project-title">{project.name.substring(0, MAX_PROJECT_NAME_LENGTH) + (project.name.length > MAX_PROJECT_NAME_LENGTH ? '...' : '')}</h3>
                    </div>

                    <div className="sync-control">
                      <span className="sync-label">
                        Concurrent Edit Prevention
                      </span>
                      <Toggle
                        checked={false}
                        disabled={false}
                        onChange={() => {
                          // No-op - toggle doesn't do anything
                        }}
                      />
                    </div>
                  </div>
                </Panel>
                
              ))}
            </div>
          )}

        </div>
      )}

      
    </div>
  );
};

export const App = memo(AppComponent);
