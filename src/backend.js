exports.httpHandler = {
  endpoints: [
    {
      method: 'PUT',
      path: 'project-flags',
      scope: 'global',
      handle: function handle(ctx) {
        try {
          const body = ctx.request.json(); // { projectId, enabled }
          const { projectId, enabled } = body || {};

          if (!projectId) {
            ctx.response.code = 400;
            ctx.response.json({ error: 'projectId required' });
            return;
          }

          // Lee flags actuales (persistidos) desde el storage declarado
          let flags = {};
          try {
            const storedFlags = ctx.globalStorage.extensionProperties.projectFlags;
            if (storedFlags) {
              flags = JSON.parse(storedFlags);
            }
          } catch (parseError) {
            console.log('⚠️ Could not parse stored flags, starting fresh:', parseError);
            flags = {};
          }

          // Actualiza ese proyecto
          flags[projectId] = !!enabled;

          // Guarda de vuelta como JSON string
          ctx.globalStorage.extensionProperties.projectFlags = JSON.stringify(flags);

          console.log(`✅ Updated flag for project ${projectId} → ${!!enabled}`);

          ctx.response.json({
            ok: true,
            projectId,
            enabled: !!enabled
          });
        } catch (error) {
          console.error('❌ Error in PUT project-flags:', error);
          ctx.response.code = 500;
          ctx.response.json({ error: 'Internal server error' });
        }
      }
    },
    {
      method: 'GET',
      path: 'project-flags',
      scope: 'global',
      handle: function handle(ctx) {
        try {
          // Lee flags desde el storage declarado
          let flags = {};
          try {
            const storedFlags = ctx.globalStorage.extensionProperties.projectFlags;
            if (storedFlags) {
              flags = JSON.parse(storedFlags);
            }
          } catch (parseError) {
            console.log('⚠️ Could not parse stored flags in GET, returning empty:', parseError);
            flags = {};
          }

          console.log('📦 Returning project flags:', flags);

          ctx.response.json({ flags });
        } catch (error) {
          console.error('❌ Error in GET project-flags:', error);
          ctx.response.code = 500;
          ctx.response.json({ error: 'Internal server error' });
        }
      }
    }
  ]
};
