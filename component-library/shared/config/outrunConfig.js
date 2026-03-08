// site/assets/outrunConfig.js
// Callback function called when outrun.js has loaded
// Config values are injected at build time from env vars (see .eleventy.js)
(async () => {
    try {
      // Wait for outrun object to be available
      await new Promise(resolve => {
        const interval = setInterval(() => {
          if (typeof outrun !== 'undefined') {
            clearInterval(interval);
            resolve();
          }
        }, 100);
      });

      outrun.init({
        apiKey: '%%OUTRUN_WIDGET_API_KEY%%',
        streamId: '%%OUTRUN_WIDGET_STREAM_ID%%',
        workspaceId: '%%OUTRUN_WIDGET_WORKSPACE_ID%%',
        autoTrack: ['click', 'hover', 'focus', 'blur', 'input', 'submit', 'page view'],
        endpoint: '%%OUTRUN_WIDGET_ENDPOINT%%',
        debug: %%OUTRUN_WIDGET_DEBUG%%
      });

      // Initialize live chat widget
      // Chat will only display if a support agent is attached to this website source
      outrun.chat.init({
        sourceId: '%%OUTRUN_WIDGET_SOURCE_ID%%',
        token: '%%OUTRUN_WIDGET_TOKEN%%',
      });

    } catch (error) {
      console.error('Error initializing Outrun SDK:', error);
    }
  })();