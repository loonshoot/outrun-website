// outrunConfig.js
// Callback function called when outrun.js has loaded
function onOutrunLoaded() {
    outrun.init({
      apiKey: '665c6b40fbf97f706b3a5770', // Replace with your actual API key
      streamId: 'clwywk7pm0002vy0cch5huu9w',
      workspaceId: 'clwuoes0m000h12daa5gjbrvc', // Replace with your actual Workspace ID
      autoTrack: ['click', 'hover', 'focus', 'blur', 'input', 'submit', 'page view'], // Enable all autoTrack events
      // Optional:
      // endpoint: 'us.core.getoutrun.com', // Default is us.core.getoutrun.com
      // eventNames: { click: 'custom_click', page view: 'custom_page_view' }, // Optional custom event names
      debug: true // Optional for debugging
    });
  }