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

  // Lista de proyectos
  const [projects, setProjects] = useState<Project[]>([]);

  // Flags por proyecto: { [projectId: string]: boolean }
  const [projectFlags, setProjectFlags] = useState<Record<string, boolean>>({});

  // Estado UI
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  //
  // 1. Registrar el host (YTApp.register)
  //
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const registeredHost = await YTApp.register();
        if (mounted) {
          setHost(registeredHost);
        }
      } catch (e) {
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

  //
  // Helpers de log
  //
  const logProjectsDebug = useCallback((result: unknown) => {
    console.log('✅ YouTrack projects response:', result);
    console.log('🔍 Is array?', Array.isArray(result));
    if (Array.isArray(result)) {
      console.log('📏 Project count:', result.length);
    }
  }, []);

  //
  // 2. Cargar lista de proyectos desde la API de YouTrack
  //
  const fetchProjects = useCallback(async () => {
    if (!host) {
      return;
    }

    try {
      console.log('🚀 Fetching projects from admin/projects');
      const result = await host.fetchYouTrack('admin/projects', {
        query: {
          fields:
            'id,name,shortName,description,createdBy(login,name,id),leader(login,name,id)',
          '$top': 20
        }
      });

      logProjectsDebug(result);

      const projectsArray = Array.isArray(result) ? result : [];
      setProjects(projectsArray as Project[]);
    } catch (err: unknown) {
      console.error('❌ Failed to fetch projects:', err);
      setError(
        `Failed to load projects: ${
          err instanceof Error ? err.message : 'Unknown error'
        }`
      );
    }
  }, [host, logProjectsDebug]);

  //
  // 3. Cargar flags guardados en el backend de la app
  //    GET backend/project-flags  -> { flags: { [projectId]: boolean } }
  //
  const fetchProjectFlags = useCallback(async () => {
    if (!host) {
      return;
    }

    try {
      console.log('🚀 Fetching project flags from backend/project-flags');
      console.log('🔧 Host object:', host);
      const result = await host.fetchApp('backend/project-flags', {
        scope: false
      });

      console.log('📦 Flags result from backend:', result);
      if (result && typeof result === 'object' && 'flags' in result) {
        // @ts-expect-error runtime check
        setProjectFlags(result.flags || {});
      } else {
        setProjectFlags({});
      }
    } catch (err) {
      console.error('❌ Failed to fetch project flags:', err);
      console.error('❌ Error details:', {
        message: err instanceof Error ? err.message : 'Unknown error',
        stack: err instanceof Error ? err.stack : 'No stack trace',
        fullError: err
      });
      // If flags fail, we still continue. Default is all false.
      setProjectFlags({});
    }
  }, [host]);

  //
  // 4. Actualizar flag de un proyecto (PUT backend/project-flags)
  //
  const updateProjectFlag = useCallback(
    async (projectId: string, newValue: boolean) => {
      if (!host) {
        return;
      }

      console.log(
        `✏️ Updating flag for project ${projectId} -> ${newValue}`
      );

      try {
        await host.fetchApp('backend/project-flags', {
          scope: false,
          method: 'PUT',
          body: {
            projectId,
            enabled: newValue
          }
        });
        console.log('✅ Flag updated in backend');
      } catch (err) {
        console.error('❌ Failed to update flag in backend:', err);
        // Si falla, revertimos el cambio local
        setProjectFlags(prev => ({
          ...prev,
          [projectId]: !newValue
        }));
      }
    },
    [host]
  );

  //
  // 5. Función de toggle click handler
  //
  const handleToggleChange = useCallback(
    (projectId: string) => {
      setProjectFlags(prev => {
        const current = !!prev[projectId];
        const nextValue = !current;

        // UI optimista: cambiamos ya
        const updated = {
          ...prev,
          [projectId]: nextValue
        };

        // y luego avisamos al backend
        updateProjectFlag(projectId, nextValue);

        return updated;
      });
    },
    [updateProjectFlag]
  );

  //
  // 6. Cargar todo cuando el host está listo
  //
  useEffect(() => {
    if (!host) {
      return;
    }

    // Vamos a cargar proyectos y flags en paralelo,
    // y cuando terminen quitamos loading.
    (async () => {
      setLoading(true);
      setError(null);

      await Promise.all([
        fetchProjects(),
        fetchProjectFlags()
      ]);

      setLoading(false);
    })();
  }, [host, fetchProjects, fetchProjectFlags]);

  //
  // Render
  //
  return (
    <div className="widget">
      {error && (
        <div className="error-message">
          {error}{' '}
          <Button onClick={fetchProjects}>Retry</Button>
        </div>
      )}

      {loading ? (
        <LoaderInline />
      ) : (
        <div className="projects-list">
          {projects.length === 0 ? (
            <div className="no-projects">No projects found</div>
          ) : (
            <div className="projects-grid">
              {projects.map(project => {
                const enabled = !!projectFlags[project.id];

                return (
                  <Panel
                    key={project.id}
                    className="project-card"
                  >
                    <div className="project-card-content">
                      <div className="project-header">
                        <div className="project-icon">
                          {project.shortName.substring(
                            0,
                            Math.min(
                              ICON_MAX_LENGTH,
                              project.shortName.length
                            )
                          )}
                        </div>

                        <h3 className="project-title">
                          {project.name.substring(
                            0,
                            MAX_PROJECT_NAME_LENGTH
                          ) +
                            (project.name.length >
                            MAX_PROJECT_NAME_LENGTH
                              ? '...'
                              : '')}
                        </h3>
                      </div>

                      <div className="sync-control">
                        <span className="sync-label">
                          Concurrent Edit Prevention
                        </span>

                        <Toggle
                          checked={enabled}
                          disabled={false}
                          onChange={() => handleToggleChange(project.id)}
                        />
                      </div>
                    </div>
                  </Panel>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const App = memo(AppComponent);
