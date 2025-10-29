exports.httpHandler = {
  endpoints: [
    {
      method: 'GET',
      path: '/test',
      scope: 'global',
      handle: function handle(ctx) {
        // See https://www.jetbrains.com/help/youtrack/devportal-apps/apps-reference-http-handlers.html#request
        const requestParam = ctx.request.getParameter('test');
        
        // Log the app settings according to YouTrack documentation
        console.log('🔧 Reading app settings from ctx.settings...');
        console.log('📋 All settings:', ctx.settings);
        console.log('🎛️ ConcurrentEdit setting:', ctx.settings.ConcurrentEdit);
        console.log('📊 ConcurrentEdit type:', typeof ctx.settings.ConcurrentEdit);
        
        // See https://www.jetbrains.com/help/youtrack/devportal-apps/apps-reference-http-handlers.html#response
        ctx.response.json({
          test: requestParam,
          concurrentEditSetting: ctx.settings.ConcurrentEdit,
          allSettings: ctx.settings
        });
      }
    }
  ]
};
