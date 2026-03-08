// outrun.js
(function() {
  const DEFAULT_ENDPOINT = 'us.getoutrun.com';
  const DEFAULT_EVENT_NAMES = {
    'click': 'click',
    'hover': 'hover',
    'page view': 'page view',
    'form submission': 'form submission',
    'focus': 'focus',
    'blur': 'blur',
    'input': 'input',
    'submit': 'submit'
  };

  let apiKey, workspaceId, endpoint, autoTrack, eventNames, debug, deviceId, streamId;
  let pageviewSent = false; // Flag to track pageview event
  let eventQueue = []; // Array to store events
  let processingQueue = []; // Array to store events being processed
  let pagePath = window.location.pathname; // Get the page path
  let domain = window.location.hostname; // Get the domain
  let errorCount = 0; // Counter for failed send attempts
  let sending = false; // Flag to track if sending is in progress
  let sendIntervalId = null; // Interval ID for sending events
  let MAX_EVENTS_PER_SEND = 50; // Maximum events to send at once

  window.outrun = {
    init: function(config) {
      apiKey = config.apiKey;
      workspaceId = config.workspaceId;
      endpoint = config.endpoint || DEFAULT_ENDPOINT;
      autoTrack = config.autoTrack || [];
      eventNames = { ...DEFAULT_EVENT_NAMES, ...config.eventNames };
      debug = config.debug || false;
      streamId = config.streamId; // Add streamId to the config

      if (!apiKey || !workspaceId || !streamId) { // Validate streamId
        console.error('Outrun SDK: API key, workspace ID, and stream ID are required.');
        return;
      }

      // Get or generate outrun_device_id
      deviceId = getDeviceId();

      // Clear local storage on initialization
      localStorage.removeItem('outrunEvents');
      localStorage.removeItem('outrunProcessingEvents');

      // Load events from local storage (if any)
      const storedEvents = localStorage.getItem('outrunEvents');
      if (storedEvents) {
        eventQueue = JSON.parse(storedEvents);
      }

      // Trigger initial pageview event
      outrun.stream('page view');

      // Initialize auto-tracking if specified
      if (autoTrack.length > 0) {
        autoTrack.forEach(event => {
          if (event === 'click') {
            document.addEventListener('click', (event) => {
              outrun.stream('click', { selector: getSelector(event.target) });
            });
          } else if (event === 'hover') {
            document.addEventListener('mouseover', (event) => {
              outrun.stream('hover', { selector: getSelector(event.target) });
            });
          } else if (event === 'focus') {
            document.addEventListener('focus', (event) => {
              outrun.stream('focus', { selector: getSelector(event.target) });
            });
          } else if (event === 'blur') {
            document.addEventListener('blur', (event) => {
              outrun.stream('blur', { selector: getSelector(event.target) });
            });
          } else if (event === 'input') {
            document.addEventListener('input', (event) => {
              outrun.stream('input', { selector: getSelector(event.target), value: event.target.value });
            });
          } else if (event === 'submit') {
            document.addEventListener('submit', (event) => {
              event.preventDefault();
              const formData = new FormData(event.target);
              const data = {};
              for (const [key, value] of formData.entries()) {
                data[key] = value;
              }
              outrun.stream('submit', { selector: getSelector(event.target), data: data });
            });
          }
        });
      }

      if (debug) {
        console.log('Outrun SDK initialized with debug mode enabled.');
      }
    },

    // -----------------------------------------------------------------------
    // Chat Widget
    // -----------------------------------------------------------------------
    chat: (function() {
      let chatSourceId, chatToken, chatConversationId, chatVisitorName;
      let chatEventSource = null;
      let chatOpen = false;
      let chatMessages = [];
      let chatRoot = null;
      let chatShadow = null;
      let chatAvatarUrl = null;
      let chatDefaultTitle = "Say G'Day";
      let chatAgentName = null;
      // Accent color — default Outrun pink
      let chatAccentHex = '#db2777';
      let chatAccentR = 219, chatAccentG = 39, chatAccentB = 119;

      function _parseHex(hex) {
        hex = hex.replace(/^#/, '');
        if (hex.length === 3) hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
        return { r: parseInt(hex.substring(0,2),16), g: parseInt(hex.substring(2,4),16), b: parseInt(hex.substring(4,6),16) };
      }
      function _lightenHex(hex, amount) {
        var c = _parseHex(hex);
        var r = Math.min(255, c.r + Math.round((255 - c.r) * amount));
        var g = Math.min(255, c.g + Math.round((255 - c.g) * amount));
        var b = Math.min(255, c.b + Math.round((255 - c.b) * amount));
        return '#' + [r,g,b].map(function(v){ return v.toString(16).padStart(2,'0'); }).join('');
      }
      function _accentRgba(a) { return 'rgba(' + chatAccentR + ',' + chatAccentG + ',' + chatAccentB + ',' + a + ')'; }
      function _autoResize(el) { el.style.height = 'auto'; el.style.height = Math.min(el.scrollHeight, 120) + 'px'; }

      function _updateHeaderTitle() {
        if (!chatShadow) return;
        var h3 = chatShadow.querySelector('.outrun-chat-header-info h3');
        if (h3) h3.textContent = chatAgentName || chatDefaultTitle;
      }

      function _detectAgentName(messages) {
        // Scan messages for agentName — use the most recent one
        for (var i = messages.length - 1; i >= 0; i--) {
          if (messages[i].role === 'agent' && messages[i].agentName) {
            chatAgentName = messages[i].agentName;
            _updateHeaderTitle();
            return;
          }
        }
      }

      var DEFAULT_AVATAR = 'data:image/jpeg;base64,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';

      function _baseUrl() {
        var protocol = endpoint.indexOf('localhost') === 0 || endpoint.indexOf('127.0.0.1') === 0 ? 'http://' : 'https://';
        return protocol + endpoint + '/api/v1/chat/' + workspaceId + '/' + chatSourceId;
      }

      function _storageKey() {
        return 'outrun_chat_conv_' + chatSourceId;
      }

      function _connectSSE() {
        if (chatEventSource) return;
        if (!chatConversationId) return;
        var url = _baseUrl() + '/conversation/' + chatConversationId + '/events?token=' + encodeURIComponent(chatToken);
        chatEventSource = new EventSource(url);
        chatEventSource.onmessage = function(e) {
          try {
            var msg = JSON.parse(e.data);
            if (msg.type === 'message' && msg.role === 'agent') {
              chatMessages.push(msg);
              if (msg.agentName) { chatAgentName = msg.agentName; _updateHeaderTitle(); }
              _renderMessages();
              _hideTyping();
            } else if (msg.type === 'collect_email') {
              _showEmailCapture(msg.message);
              _hideTyping();
            }
          } catch (err) {
            // ignore parse errors
          }
        };
        chatEventSource.onerror = function() {
          // Reconnect handled by EventSource automatically
        };
      }

      function _showTyping() {
        if (!chatShadow) return;
        var el = chatShadow.getElementById('outrun-chat-typing');
        if (el) { el.classList.add('active'); }
        var container = chatShadow.getElementById('outrun-chat-messages');
        if (container) container.scrollTop = container.scrollHeight;
      }

      function _hideTyping() {
        if (!chatShadow) return;
        var el = chatShadow.getElementById('outrun-chat-typing');
        if (el) { el.classList.remove('active'); }
      }

      function _showEmailCapture(promptMessage) {
        if (!chatShadow) return;
        // Show the prompt as an agent message
        if (promptMessage) {
          chatMessages.push({ content: promptMessage, role: 'agent', timestamp: new Date().toISOString() });
          _renderMessages();
        }
        // Replace the input area with email capture form
        var inputArea = chatShadow.querySelector('.outrun-chat-input-area');
        if (!inputArea) return;
        inputArea.innerHTML = [
          '<input type="email" id="outrun-chat-email-input" placeholder="you@example.com" />',
          '<button class="outrun-chat-send" id="outrun-chat-email-btn">',
          '  <svg viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>',
          '</button>',
        ].join('\n');

        var emailInput = chatShadow.getElementById('outrun-chat-email-input');
        var emailBtn = chatShadow.getElementById('outrun-chat-email-btn');

        emailBtn.onclick = function() {
          var val = emailInput.value.trim();
          if (val && val.indexOf('@') > 0 && val.indexOf('.') > 0) {
            _submitEmail(val);
          } else {
            emailInput.style.borderColor = '#ef4444';
          }
        };
        emailInput.onkeydown = function(e) {
          if (e.key === 'Enter') {
            e.preventDefault();
            emailBtn.click();
          }
        };
        emailInput.onfocus = function() {
          emailInput.style.borderColor = chatAccentHex;
        };
        emailInput.focus();
      }

      function _submitEmail(email) {
        if (!chatShadow || !chatConversationId) return;
        var url = _baseUrl() + '/conversation/' + chatConversationId + '/email';
        fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + chatToken
          },
          body: JSON.stringify({ email: email })
        })
        .then(function(r) {
          if (r.ok) {
            _restoreNormalInput();
            // Confirmation message will arrive via SSE
          } else {
            // Show inline error
            var emailInput = chatShadow.getElementById('outrun-chat-email-input');
            if (emailInput) emailInput.style.borderColor = '#ef4444';
          }
        })
        .catch(function() {
          var emailInput = chatShadow.getElementById('outrun-chat-email-input');
          if (emailInput) emailInput.style.borderColor = '#ef4444';
        });
      }

      function _restoreNormalInput() {
        if (!chatShadow) return;
        var inputArea = chatShadow.querySelector('.outrun-chat-input-area');
        if (!inputArea) return;
        inputArea.innerHTML = [
          '<textarea id="outrun-chat-input" placeholder="Type a message..." rows="1"></textarea>',
          '<button class="outrun-chat-send" id="outrun-chat-send-btn">',
          '  <svg viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>',
          '</button>',
        ].join('\n');

        // Re-bind send
        chatShadow.getElementById('outrun-chat-send-btn').onclick = function() {
          var input = chatShadow.getElementById('outrun-chat-input');
          if (input.value.trim()) {
            outrun.chat.send(input.value.trim());
            input.value = '';
            _autoResize(input);
          }
        };
        var input = chatShadow.getElementById('outrun-chat-input');
        input.onkeydown = function(e) {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            chatShadow.getElementById('outrun-chat-send-btn').click();
          }
        };
        input.oninput = function() { _autoResize(input); };
      }

      function _disconnectSSE() {
        if (chatEventSource) {
          chatEventSource.close();
          chatEventSource = null;
        }
      }

      function _loadHistory() {
        if (!deviceId) return;
        fetch(_baseUrl() + '/conversations?deviceId=' + encodeURIComponent(deviceId), {
          headers: { 'Authorization': 'Bearer ' + chatToken }
        })
        .then(function(r) { return r.json(); })
        .then(function(data) {
          if (data.conversation && data.conversation.conversationId) {
            chatConversationId = data.conversation.conversationId;
            localStorage.setItem(_storageKey(), chatConversationId);
            chatMessages = data.messages || [];
            _detectAgentName(chatMessages);
            _renderMessages();
            _connectSSE();
          }
        })
        .catch(function() { /* ignore */ });
      }

      function _renderLauncher() {
        if (chatRoot) return;
        chatRoot = document.createElement('div');
        chatRoot.id = 'outrun-chat-root';
        document.body.appendChild(chatRoot);
        chatShadow = chatRoot.attachShadow({ mode: 'open' });

        var accentLight = _lightenHex(chatAccentHex, 0.45);
        var style = document.createElement('style');
        style.textContent = [
          '*, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }',
          ':host { font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif; }',
          /* Launcher */
          '.outrun-chat-launcher { position:fixed; bottom:24px; right:24px; width:56px; height:56px; background:' + _accentRgba(0.12) + '; backdrop-filter:blur(20px); -webkit-backdrop-filter:blur(20px); border:1px solid ' + _accentRgba(0.3) + '; cursor:pointer; display:flex; align-items:center; justify-content:center; z-index:999999; padding:0; transition:box-shadow 0.3s, border-color 0.3s; box-shadow:0 4px 24px ' + _accentRgba(0.2) + '; }',
          '.outrun-chat-launcher:hover { border-color:' + _accentRgba(0.6) + '; box-shadow:0 0 30px ' + _accentRgba(0.5) + '; }',
          '.outrun-chat-launcher svg { width:24px; height:24px; fill:none; stroke:' + accentLight + '; stroke-width:1.5; stroke-linecap:round; stroke-linejoin:round; }',
          /* Panel — fully transparent frosted glass */
          '.outrun-chat-panel { position:fixed; bottom:96px; right:24px; width:400px; height:560px; background:rgba(10,10,10,0.45); backdrop-filter:blur(40px) saturate(1.2); -webkit-backdrop-filter:blur(40px) saturate(1.2); border:1px solid rgba(255,255,255,0.06); display:none; flex-direction:column; z-index:999999; box-shadow:0 24px 80px rgba(0,0,0,0.4); overflow:hidden; }',
          '.outrun-chat-panel.open { display:flex; }',
          /* Header */
          '.outrun-chat-header { padding:0 20px; background:transparent; border-bottom:1px solid rgba(255,255,255,0.06); display:flex; align-items:center; gap:10px; }',
          '.outrun-chat-header-info { flex:1; }',
          '.outrun-chat-header-info h3 { color:#fff; font-size:18px; font-weight:600; line-height:1.2; letter-spacing:-0.01em; }',
          '.outrun-chat-header-info span { color:rgba(255,255,255,0.35); font-size:12px; line-height:1.2; }',
          '.outrun-chat-status { display:inline-block; width:6px; height:6px; background:#22c55e; border-radius:50%; margin-right:4px; vertical-align:middle; }',
          '.outrun-chat-close { background:none; border:none; color:rgba(255,255,255,0.25); cursor:pointer; font-size:66px; padding:4px 8px; line-height:1; transition:color 0.15s; }',
          '.outrun-chat-close:hover { color:#fff; }',
          /* Messages */
          '.outrun-chat-messages { flex:1; overflow-y:auto; padding:20px; display:flex; flex-direction:column; gap:16px; }',
          '.outrun-chat-messages::-webkit-scrollbar { width:2px; }',
          '.outrun-chat-messages::-webkit-scrollbar-track { background:transparent; }',
          '.outrun-chat-messages::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.08); }',
          /* Message rows — no bubbles, just aligned text with sender name */
          '.outrun-chat-msg-row { display:flex; flex-direction:column; }',
          '.outrun-chat-msg-row.visitor { align-items:flex-end; }',
          '.outrun-chat-msg-row.agent { align-items:flex-start; }',
          '.outrun-chat-msg { max-width:85%; padding:0; font-size:21px; line-height:1.55; word-wrap:break-word; letter-spacing:-0.01em; background:none; border:none; transition:color 0.15s ease; text-shadow:0 1px 6px rgba(0,0,0,0.4); }',
          '.outrun-chat-msg.visitor { color:rgba(255,255,255,0.2); text-align:right; }',
          '.outrun-chat-msg.agent { color:rgba(255,255,255,0.2); text-align:left; }',
          '.outrun-chat-sender { font-size:10px; color:rgba(255,255,255,0.15); margin-top:3px; letter-spacing:0.02em; transition:color 0.15s ease; }',
          /* Typing indicator */
          '.outrun-chat-typing { display:none; align-items:center; padding:4px 0; }',
          '.outrun-chat-typing.active { display:flex; }',
          '.outrun-chat-typing-dots { display:flex; gap:5px; padding:0; }',
          '.outrun-chat-typing-dots span { width:5px; height:5px; background:' + chatAccentHex + '; border-radius:50%; display:block; animation:outrun-bounce 1.2s infinite; }',
          '.outrun-chat-typing-dots span:nth-child(2) { animation-delay:0.2s; }',
          '.outrun-chat-typing-dots span:nth-child(3) { animation-delay:0.4s; }',
          '@keyframes outrun-bounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-4px)} }',
          /* Input */
          '.outrun-chat-input-area { padding:16px 20px; border-top:1px solid rgba(255,255,255,0.06); display:flex; align-items:flex-end; gap:10px; background:transparent; }',
          '.outrun-chat-input-area textarea { flex:1; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.08); color:#fff; padding:10px 16px; font-size:16px; outline:none; transition:border-color 0.15s; font-family:inherit; resize:none; overflow:hidden; line-height:1.4; min-height:42px; max-height:120px; }',
          '.outrun-chat-input-area textarea::placeholder { color:rgba(255,255,255,0.2); }',
          '.outrun-chat-input-area textarea:focus { border-color:' + _accentRgba(0.4) + '; }',
          '.outrun-chat-input-area input { flex:1; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.08); color:#fff; padding:10px 16px; font-size:16px; outline:none; transition:border-color 0.15s; font-family:inherit; min-height:42px; }',
          '.outrun-chat-input-area input::placeholder { color:rgba(255,255,255,0.2); }',
          '.outrun-chat-input-area input:focus { border-color:' + _accentRgba(0.4) + '; }',
          '.outrun-chat-send { background:' + _accentRgba(0.8) + '; color:#fff; border:none; width:42px; min-height:42px; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:background 0.15s; flex-shrink:0; align-self:flex-end; }',
          '.outrun-chat-send:hover { background:' + _accentRgba(1) + '; }',
          '.outrun-chat-send svg { width:18px; height:18px; fill:none; stroke:currentColor; stroke-width:2; stroke-linecap:round; stroke-linejoin:round; }',
          /* Empty state */
          '.outrun-chat-empty { color:rgba(255,255,255,0.3); text-align:center; padding:40px 24px; font-size:20px; line-height:1.5; }',
          '.outrun-chat-empty-icon { margin:0 auto 16px; }',
          '.outrun-chat-empty-icon svg { width:36px; height:36px; fill:none; stroke:' + _accentRgba(0.6) + '; stroke-width:1.5; stroke-linecap:round; stroke-linejoin:round; }',
          /* Powered by */
          '.outrun-chat-powered { text-align:center; padding:6px 6px 16px; font-size:10px; color:rgba(255,255,255,0.15); background:transparent; border-top:1px solid rgba(255,255,255,0.04); display:flex; align-items:center; justify-content:center; gap:4px; }',
          '.outrun-chat-powered a { color:rgba(255,255,255,0.2); text-decoration:none; display:inline-flex; align-items:center; gap:3px; }',
          '.outrun-chat-powered a:hover { color:rgba(255,255,255,0.4); }',
          '.outrun-chat-powered a svg { opacity:0.3; transition:opacity 0.15s; }',
          '.outrun-chat-powered a:hover svg { opacity:0.6; }',
          /* Mobile: launcher above bottom nav, panel full-screen above nav */
          '@media (max-width:767px) {',
          '  .outrun-chat-launcher { bottom:80px; right:16px; }',
          '  .outrun-chat-panel { bottom:64px; right:0; left:0; top:0; width:100%; height:auto; border:none; border-bottom:1px solid rgba(255,255,255,0.06); }',
          '}',
        ].join('\n');
        chatShadow.appendChild(style);

        // Launcher button
        var launcher = document.createElement('button');
        launcher.className = 'outrun-chat-launcher';
        launcher.innerHTML = '<svg viewBox="0 0 24 24"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>';
        launcher.onclick = function() {
          if (chatOpen) { outrun.chat.close(); } else { outrun.chat.open(); }
        };
        chatShadow.appendChild(launcher);

        // Chat panel
        var panel = document.createElement('div');
        panel.className = 'outrun-chat-panel';
        panel.id = 'outrun-chat-panel';

        panel.innerHTML = [
          '<div class="outrun-chat-header">',
          '  <div class="outrun-chat-header-info">',
          '    <h3>' + (chatAgentName || chatDefaultTitle) + '</h3>',
          '  </div>',
          '  <button class="outrun-chat-close" id="outrun-chat-close-btn">&times;</button>',
          '</div>',
          '<div class="outrun-chat-messages" id="outrun-chat-messages">',
          '  <div class="outrun-chat-empty">',
          '    <div class="outrun-chat-empty-icon"><svg viewBox="0 0 24 24"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg></div>',
          '    <div>How can I help you today?</div>',
          '  </div>',
          '</div>',
          '<div class="outrun-chat-input-area">',
          '  <textarea id="outrun-chat-input" placeholder="Type a message..." rows="1"></textarea>',
          '  <button class="outrun-chat-send" id="outrun-chat-send-btn">',
          '    <svg viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>',
          '  </button>',
          '</div>',
          '<div class="outrun-chat-powered">Powered by <a href="https://getoutrun.com" target="_blank" rel="noopener"><svg viewBox="0 0 129 18" width="65" height="9" fill="none" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="or-g0" x1="14" y1="0" x2="14" y2="28" gradientUnits="userSpaceOnUse"><stop stop-color="#FFC900"/><stop offset="0.65625" stop-color="#FE0070"/></linearGradient><clipPath id="or-c0"><rect width="129" height="18" fill="white"/></clipPath><clipPath id="or-c1"><rect width="28" height="18" fill="white"/></clipPath></defs><g clip-path="url(#or-c0)"><path d="M40.212 3.932C41.476 3.932 42.548 4.208 43.428 4.76C44.308 5.312 44.976 6.092 45.432 7.1C45.896 8.1 46.128 9.272 46.128 10.616C46.128 11.992 45.896 13.184 45.432 14.192C44.968 15.2 44.296 15.98 43.416 16.532C42.536 17.084 41.464 17.36 40.2 17.36C38.944 17.36 37.872 17.092 36.984 16.556C36.104 16.012 35.432 15.24 34.968 14.24C34.504 13.232 34.272 12.032 34.272 10.64C34.272 9.312 34.504 8.144 34.968 7.136C35.432 6.128 36.108 5.344 36.996 4.784C37.884 4.216 38.956 3.932 40.212 3.932ZM40.212 6.32C39.324 6.32 38.66 6.668 38.22 7.364C37.788 8.06 37.572 9.152 37.572 10.64C37.572 12.144 37.788 13.244 38.22 13.94C38.652 14.628 39.312 14.972 40.2 14.972C41.088 14.972 41.748 14.628 42.18 13.94C42.612 13.244 42.828 12.136 42.828 10.616C42.828 9.136 42.612 8.052 42.18 7.364C41.748 6.668 41.092 6.32 40.212 6.32ZM52.4906 4.292V13.1C52.4906 13.788 52.6266 14.272 52.8986 14.552C53.1706 14.832 53.5666 14.972 54.0866 14.972C54.5826 14.972 55.0666 14.824 55.5386 14.528C56.0106 14.224 56.3946 13.84 56.6906 13.376V4.292H59.8586V17H57.0986L56.9306 15.44C56.4746 16.064 55.8906 16.54 55.1786 16.868C54.4666 17.196 53.7306 17.36 52.9706 17.36C51.7466 17.36 50.8306 17.016 50.2226 16.328C49.6226 15.632 49.3226 14.684 49.3226 13.484V4.292H52.4906ZM74.6813 16.292C74.2093 16.604 73.6373 16.86 72.9653 17.06C72.2933 17.26 71.5653 17.36 70.7813 17.36C69.2293 17.36 68.0613 16.96 67.2773 16.16C66.4933 15.352 66.1013 14.28 66.1013 12.944V6.536H63.3413V4.292H66.1013V1.496L69.2693 1.112V4.292H73.4693L73.1453 6.536H69.2693V12.932C69.2693 13.588 69.4293 14.068 69.7493 14.372C70.0693 14.676 70.5853 14.828 71.2973 14.828C71.7533 14.828 72.1693 14.776 72.5453 14.672C72.9293 14.56 73.2773 14.42 73.5893 14.252L74.6813 16.292ZM78.2239 17V14.804H80.0119V6.476H78.2239V4.292H82.4239L83.0119 7.208C83.4759 6.128 84.0599 5.316 84.7639 4.772C85.4679 4.22 86.3519 3.944 87.4159 3.944C87.8239 3.944 88.1839 3.976 88.4959 4.04C88.8159 4.104 89.1199 4.188 89.4079 4.292L88.4599 6.956C88.2119 6.892 87.9759 6.844 87.7519 6.812C87.5279 6.772 87.2759 6.752 86.9959 6.752C86.1159 6.752 85.3479 7.096 84.6919 7.784C84.0439 8.464 83.5399 9.388 83.1799 10.556V14.804H85.7119V17H78.2239ZM86.7319 9.248V5.876L87.1639 4.292H89.4079L88.8439 9.248H86.7319ZM95.6625 4.292V13.1C95.6625 13.788 95.7985 14.272 96.0705 14.552C96.3425 14.832 96.7385 14.972 97.2585 14.972C97.7545 14.972 98.2385 14.824 98.7105 14.528C99.1825 14.224 99.5665 13.84 99.8625 13.376V4.292H103.031V17H100.271L100.103 15.44C99.6465 16.064 99.0625 16.54 98.3505 16.868C97.6385 17.196 96.9025 17.36 96.1425 17.36C94.9185 17.36 94.0025 17.016 93.3945 16.328C92.7945 15.632 92.4945 14.684 92.4945 13.484V4.292H95.6625ZM106.885 17V4.292H109.645L109.873 5.864C110.417 5.224 111.029 4.744 111.709 4.424C112.389 4.096 113.121 3.932 113.905 3.932C115.049 3.932 115.921 4.264 116.521 4.928C117.121 5.584 117.421 6.508 117.421 7.7V17H114.253V8.936C114.253 8.296 114.213 7.784 114.133 7.4C114.053 7.008 113.901 6.728 113.677 6.56C113.453 6.384 113.129 6.296 112.705 6.296C112.361 6.296 112.029 6.372 111.709 6.524C111.397 6.676 111.101 6.88 110.821 7.136C110.549 7.392 110.293 7.676 110.053 7.988V17H106.885ZM124.06 14.876C124.06 14.428 124.168 14.016 124.384 13.64C124.608 13.264 124.908 12.964 125.284 12.74C125.66 12.516 126.076 12.404 126.532 12.404C126.996 12.404 127.416 12.516 127.792 12.74C128.168 12.964 128.464 13.264 128.68 13.64C128.904 14.016 129.016 14.428 129.016 14.876C129.016 15.324 128.904 15.74 128.68 16.124C128.464 16.5 128.168 16.8 127.792 17.024C127.416 17.248 126.996 17.36 126.532 17.36C126.076 17.36 125.66 17.248 125.284 17.024C124.908 16.8 124.608 16.5 124.384 16.124C124.168 15.74 124.06 15.324 124.06 14.876Z" fill="white"/><g clip-path="url(#or-c1)"><mask id="or-m0" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="33" height="19"><path d="M29.0784 9.13803L0.0761856 9.00005L0.119005 0.000147455L29.1212 0.138133L29.0784 9.13803Z" fill="#D9D9D9"/><path d="M28.7213 14.1366L0.0333602 14.0001L0.0428756 12.0002L28.7308 12.1366L28.7213 14.1366Z" fill="#D9D9D9"/><path d="M32.8437 18.1562L0.0333534 18.0001L0.0476265 15.0002L32.858 15.1563L32.8437 18.1562Z" fill="#D9D9D9"/><path d="M30.7247 11.1462L0.0333027 11.0002L0.0380604 10.0002L30.7294 10.1462L30.7247 11.1462Z" fill="#D9D9D9"/></mask><g mask="url(#or-m0)"><path d="M28 14C28 21.732 21.732 28 14 28C6.26801 28 0 21.732 0 14C0 6.26801 6.26801 0 14 0C21.732 0 28 6.26801 28 14Z" fill="url(#or-g0)"/></g></g></g></svg></a></div>',
        ].join('\n');
        chatShadow.appendChild(panel);

        // Bind close button
        chatShadow.getElementById('outrun-chat-close-btn').onclick = function() {
          outrun.chat.close();
        };

        // Bind send
        chatShadow.getElementById('outrun-chat-send-btn').onclick = function() {
          var input = chatShadow.getElementById('outrun-chat-input');
          if (input.value.trim()) {
            outrun.chat.send(input.value.trim());
            input.value = '';
            _autoResize(input);
          }
        };

        // Enter sends, Shift+Enter for newline
        var chatInput = chatShadow.getElementById('outrun-chat-input');
        chatInput.onkeydown = function(e) {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            chatShadow.getElementById('outrun-chat-send-btn').click();
          }
        };
        chatInput.oninput = function() { _autoResize(chatInput); };

        _bindScrollFocus();
      }

      function _renderMessages() {
        if (!chatShadow) return;
        var container = chatShadow.getElementById('outrun-chat-messages');
        if (!container) return;
        if (chatMessages.length === 0) {
          container.innerHTML = '<div class="outrun-chat-empty"><div class="outrun-chat-empty-icon"><svg viewBox="0 0 24 24"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg></div><div>How can I help you today?</div></div>';
          return;
        }
        var html = chatMessages.map(function(m) {
          var cls = m.role === 'visitor' ? 'visitor' : 'agent';
          var senderName = cls === 'visitor' ? (chatVisitorName && chatVisitorName !== 'Visitor' ? chatVisitorName.split(' ')[0] : 'You') : (m.agentName || chatAgentName || chatDefaultTitle);
          var escaped = (m.content || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
          return '<div class="outrun-chat-msg-row ' + cls + '"><div class="outrun-chat-msg ' + cls + '">' + escaped + '</div><div class="outrun-chat-sender">' + senderName + '</div></div>';
        }).join('');
        // Add typing indicator at the end (hidden by default)
        html += '<div class="outrun-chat-typing" id="outrun-chat-typing"><div class="outrun-chat-typing-dots"><span></span><span></span><span></span></div></div>';
        container.innerHTML = html;
        // Padding + scroll positioning deferred to _positionMessages (needs visible panel)
        if (chatOpen) {
          _positionMessages(container);
        }
      }

      function _positionMessages(container) {
        if (!container) {
          container = chatShadow && chatShadow.getElementById('outrun-chat-messages');
        }
        if (!container) return;
        _applyScrollPadding(container);
        var savedScroll = localStorage.getItem(_scrollKey());
        if (savedScroll !== null) {
          container.scrollTop = parseFloat(savedScroll);
        } else {
          _scrollToLastCenter(container);
        }
        _updateScrollFocus();
      }

      function _updateScrollFocus() {
        if (!chatShadow) return;
        var container = chatShadow.getElementById('outrun-chat-messages');
        if (!container) return;
        var rows = container.querySelectorAll('.outrun-chat-msg-row');
        if (!rows.length) return;

        var containerRect = container.getBoundingClientRect();
        var centerY = containerRect.top + containerRect.height * 0.5;
        // How far from center before fully dim (in px)
        var fadeRange = containerRect.height * 0.45;

        for (var i = 0; i < rows.length; i++) {
          var row = rows[i];
          var msgEl = row.querySelector('.outrun-chat-msg');
          var senderEl = row.querySelector('.outrun-chat-sender');
          if (!msgEl) continue;

          var rect = msgEl.getBoundingClientRect();
          // Use the vertical center of the message
          var msgCenterY = rect.top + rect.height * 0.5;
          var dist = Math.abs(msgCenterY - centerY);
          // 1 = fully bright (at center), 0 = fully dim (at edge)
          var t = Math.max(0, 1 - dist / fadeRange);
          // Map t to color: dim=0.2, bright=1.0
          var alpha = 0.2 + t * 0.8;
          var senderAlpha = 0.1 + t * 0.2;

          msgEl.style.color = 'rgba(255,255,255,' + alpha.toFixed(2) + ')';
          if (senderEl) senderEl.style.color = 'rgba(255,255,255,' + senderAlpha.toFixed(2) + ')';
        }
      }

      function _scrollKey() {
        return 'outrun_chat_scroll_' + chatSourceId;
      }

      function _applyScrollPadding(container) {
        // Use real spacer divs — CSS padding on scroll containers is unreliable
        // Remove old spacers if re-rendering
        var oldTop = container.querySelector('.outrun-chat-spacer-top');
        var oldBot = container.querySelector('.outrun-chat-spacer-bottom');
        if (oldTop) oldTop.remove();
        if (oldBot) oldBot.remove();

        var containerH = container.clientHeight;
        var pad = Math.floor(containerH * 0.4);

        var spacerTop = document.createElement('div');
        spacerTop.className = 'outrun-chat-spacer-top';
        spacerTop.style.height = pad + 'px';
        spacerTop.style.flexShrink = '0';
        container.insertBefore(spacerTop, container.firstChild);

        var spacerBot = document.createElement('div');
        spacerBot.className = 'outrun-chat-spacer-bottom';
        spacerBot.style.height = pad + 'px';
        spacerBot.style.flexShrink = '0';
        container.appendChild(spacerBot);
      }

      function _scrollToLastCenter(container) {
        var containerH = container.clientHeight;
        var rows = container.querySelectorAll('.outrun-chat-msg-row');
        if (!rows.length) return;

        // Measure total content height (all message rows)
        var firstRow = rows[0];
        var lastRow = rows[rows.length - 1];
        var contentTop = firstRow.offsetTop;
        var contentBottom = lastRow.offsetTop + lastRow.offsetHeight;
        var contentH = contentBottom - contentTop;

        if (contentH <= containerH) {
          // Content fits — center it vertically
          var midContent = contentTop + contentH / 2;
          container.scrollTop = midContent - containerH / 2;
        } else {
          // Content overflows — pin last message to the top of the viewport
          container.scrollTop = lastRow.offsetTop - 8;
        }
      }

      function _bindScrollFocus() {
        if (!chatShadow) return;
        var container = chatShadow.getElementById('outrun-chat-messages');
        if (!container || container._scrollFocusBound) return;
        container._scrollFocusBound = true;
        container.addEventListener('scroll', function() {
          _updateScrollFocus();
          // Persist scroll position
          localStorage.setItem(_scrollKey(), container.scrollTop);
        });
      }

      return {
        init: function(config) {
          chatSourceId = config.sourceId;
          chatToken = config.token;
          chatVisitorName = config.visitorName || 'Visitor';
          chatAvatarUrl = config.avatarUrl || null;
          if (config.title) chatDefaultTitle = config.title;
          // Custom accent color
          if (config.accentColor) {
            chatAccentHex = config.accentColor;
            var parsed = _parseHex(chatAccentHex);
            chatAccentR = parsed.r;
            chatAccentG = parsed.g;
            chatAccentB = parsed.b;
          }
          // Load existing conversation from localStorage
          chatConversationId = localStorage.getItem('outrun_chat_conv_' + chatSourceId) || null;
          // Check if chat is enabled (a support agent is attached) before rendering
          fetch(_baseUrl() + '/config?token=' + encodeURIComponent(chatToken))
            .then(function(r) { return r.json(); })
            .then(function(data) {
              if (data.chatEnabled) {
                // Set agent name from config before rendering
                if (data.agentName && !chatAgentName) {
                  chatAgentName = data.agentName;
                }
                _renderLauncher();
                // If returning visitor, load history
                if (chatConversationId) {
                  _loadHistory();
                }
              } else if (debug) {
                console.log('Outrun Chat: chat not enabled (no support agent attached to this source)');
              }
            })
            .catch(function(err) {
              if (debug) { console.error('Outrun Chat: config check failed', err); }
            });
        },
        open: function() {
          chatOpen = true;
          if (chatShadow) {
            var panel = chatShadow.getElementById('outrun-chat-panel');
            if (panel) panel.classList.add('open');
          }
          if (chatConversationId) {
            _connectSSE();
          }
          // Panel is now visible — apply spacers + scroll positioning
          setTimeout(function() { _positionMessages(); }, 30);
        },
        close: function() {
          chatOpen = false;
          if (chatShadow) {
            var panel = chatShadow.getElementById('outrun-chat-panel');
            if (panel) panel.classList.remove('open');
          }
          _disconnectSSE();
        },
        send: function(content) {
          if (!content || !chatSourceId || !chatToken) return;

          // Optimistic update
          var tempMsg = { content: content, role: 'visitor', timestamp: new Date().toISOString() };
          chatMessages.push(tempMsg);
          _renderMessages();
          _showTyping();

          fetch(_baseUrl() + '/message', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + chatToken
            },
            body: JSON.stringify({
              content: content,
              conversationId: chatConversationId || undefined,
              deviceId: deviceId,
              visitorName: chatVisitorName,
            })
          })
          .then(function(r) { return r.json(); })
          .then(function(data) {
            if (data.conversationId && !chatConversationId) {
              chatConversationId = data.conversationId;
              localStorage.setItem(_storageKey(), chatConversationId);
              _connectSSE();
            }
          })
          .catch(function(err) {
            console.error('Outrun Chat: send failed', err);
          });
        }
      };
    })(),

    stream: function(eventName, eventData = {}) {
      if (!apiKey || !workspaceId || !streamId) {
        console.error('Outrun SDK: API key, workspace ID, and stream ID are required.');
        return;
      }

      // Ensure pageview event is only sent once
      if (eventName === eventNames['page view'] && pageviewSent) {
        return; 
      }
      if (eventName === eventNames['page view']) {
        pageviewSent = true;
      }

      const data = {
        eventName: eventNames[eventName] || eventName,
        eventData: {
          ...eventData,
          deviceId: deviceId, // Include if available
          pagePath: pagePath, // Include page path
          domain: domain, // Include domain
          userAgent: navigator.userAgent, // Include User Agent
          screenResolution: `${window.screen.width * window.devicePixelRatio}x${window.screen.height * window.devicePixelRatio}` // Include Screen Resolution
        }
      };

      // Add the event to the queue
      eventQueue.push(data);

      // Store the events in local storage
      localStorage.setItem('outrunEvents', JSON.stringify(eventQueue));

      // Start sending events if not already in progress
      if (!sendIntervalId) {
        sendIntervalId = setInterval(sendEvents, 1000);
      }
    }
  };

  // Function to get or generate outrun_device_id
  function getDeviceId() {
    let deviceId = getCookie('outrun_device_id');
    if (!deviceId) {
      // Generate a new time-based UUID
      deviceId = generateUuid();
      setCookie('outrun_device_id', deviceId, 365); // Set cookie for 1 year
    }
    return deviceId;
  }

  // Function to generate a time-based UUID
  function generateUuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  // Helper functions for cookie management
  function getCookie(name) {
    const nameEQ = name + '=';
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  function setCookie(name, value, days) {
    let expires = '';
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = '; expires=' + date.toUTCString();
    }
    document.cookie = name + '=' + value + expires + '; path=/';
  }

  // Function to get the CSS selector of an element
  function getSelector(element) {
    if (!element) {
      return null;
    }

    let selector = '';
    let parent = element;

    while (parent) {
      if (parent.id) {
        selector = '#' + parent.id + ' ' + selector;
        break; // Stop if we find an ID
      } else {
        // Handle cases where parent is null or undefined
        if (!parent.tagName) {
          break; // Stop if parent doesn't have a tagName
        }

        const tagName = parent.tagName.toLowerCase();
        let siblingIndex = 1;
        for (let sibling = parent.previousSibling; sibling; sibling = sibling.previousSibling) {
          if (sibling.nodeType === 1 && sibling.tagName.toLowerCase() === tagName) {
            siblingIndex++;
          }
        }
        selector = tagName + ':nth-child(' + siblingIndex + ') ' + selector;
      }
      parent = parent.parentNode;
    }
    return selector.trim();
  }

  // Function to send events to the server
  var MAX_RETRIES = 5;
  var sendRetryCount = 0;

function sendEvents() {
  if (sending || sendRetryCount >= MAX_RETRIES) {
    if (sendRetryCount >= MAX_RETRIES) {
      // Stop retrying — clear interval and give up silently
      clearInterval(sendIntervalId);
      sendIntervalId = null;
    }
    return;
  }

  // Check if there are events to send
  const storedEvents = localStorage.getItem('outrunEvents');
  if (!storedEvents) {
    return; // Do nothing if there are no events
  }

  sending = true;

  // Move events from eventQueue to processingQueue
  processingQueue = eventQueue.slice(0, MAX_EVENTS_PER_SEND);
  eventQueue = eventQueue.slice(MAX_EVENTS_PER_SEND);
  localStorage.setItem('outrunEvents', JSON.stringify(eventQueue));
  localStorage.setItem('outrunProcessingEvents', JSON.stringify(processingQueue));

  const protocol = endpoint.indexOf('localhost') === 0 || endpoint.indexOf('127.0.0.1') === 0 ? 'http://' : 'https://';
  const url = `${protocol}${endpoint}/api/v1/workspace/${workspaceId}/stream/${streamId}`;

  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify(processingQueue)
  })
  .then(response => {
    if (debug) {
      console.log('Outrun SDK: Response:', response.status);
    }
    if (response.ok) {
      processingQueue = [];
      localStorage.removeItem('outrunProcessingEvents');
      sendRetryCount = 0; // Reset on success
      clearInterval(sendIntervalId);
      sendIntervalId = null;
    } else {
      sendRetryCount++;
      if (sendRetryCount < MAX_RETRIES) {
        var delay = Math.min(1000 * Math.pow(2, sendRetryCount), 30000);
        console.warn('Outrun SDK: Send failed (' + sendRetryCount + '/' + MAX_RETRIES + '), retrying in ' + delay + 'ms');
        setTimeout(sendEvents, delay);
      } else {
        console.warn('Outrun SDK: Send failed after ' + MAX_RETRIES + ' attempts, giving up');
        clearInterval(sendIntervalId);
        sendIntervalId = null;
      }
    }
  })
  .catch(error => {
    sendRetryCount++;
    if (sendRetryCount < MAX_RETRIES) {
      var delay = Math.min(1000 * Math.pow(2, sendRetryCount), 30000);
      console.warn('Outrun SDK: Send error (' + sendRetryCount + '/' + MAX_RETRIES + '), retrying in ' + delay + 'ms');
      clearInterval(sendIntervalId);
      sendIntervalId = null;
      setTimeout(sendEvents, delay);
    } else {
      console.warn('Outrun SDK: Send failed after ' + MAX_RETRIES + ' attempts, giving up');
      clearInterval(sendIntervalId);
      sendIntervalId = null;
    }
  })
  .finally(() => {
    sending = false;
  });
}
})();