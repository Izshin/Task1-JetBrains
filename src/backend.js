exports.httpHandler = {
  endpoints: [
    {
      scope: 'global',
      method: 'GET',
      path: 'debug',
      handle: function handle(ctx) {
        // See https://www.jetbrains.com/help/youtrack/devportal-apps/apps-reference-http-handlers.html#request
        const requestParam = ctx.request.getParameter('test');
        // See https://www.jetbrains.com/help/youtrack/devportal-apps/apps-reference-http-handlers.html#response
        ctx.response.json({test: requestParam});
      }
    },
    {
      scope: 'global',
      method: 'GET', 
      path: 'projects',
      handle: function handle(ctx) {
        try {
          // Use YouTrack's internal HTTP client to call REST API
          const apiResponse = ctx.http.get('/api/admin/projects?fields=id,name,shortName,description,createdBy(login,name,id),leader(login,name,id)');
          
          if (apiResponse && apiResponse.body) {
            const projects = JSON.parse(apiResponse.body);
            ctx.response.json(projects);
          } else {
            ctx.response.json([]);
          }
        } catch (error) {
          ctx.response.json({
            error: 'Failed to fetch projects: ' + error.message,
            details: error.toString()
          });
        }
      }
    }
  ]
};
