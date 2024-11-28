// site/assets/outrunConfig.js
// Callback function called when outrun.js has loaded
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
  
      // Initialize Outrun SDK
      outrun.init({
        apiKey: '665c6b40fbf97f706b3a5770', // Replace with your actual API key
        streamId: '67483fd74c2fef2fec95fcca',
        workspaceId: 'clwuoes0m000h12daa5gjbrvc', // Replace with your actual Workspace ID
        autoTrack: ['click', 'hover', 'focus', 'blur', 'input', 'submit', 'page view'], // Enable all autoTrack events
        // Optional:
        // endpoint: 'us.core.getoutrun.com', // Default is us.core.getoutrun.com
        // eventNames: { click: 'custom_click', page view: 'custom_page_view' }, // Optional custom event names
        debug: true // Optional for debugging
      });
  
    } catch (error) {
      console.error('Error initializing Outrun SDK:', error);
    }
  })();