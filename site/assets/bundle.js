document.addEventListener("DOMContentLoaded", function () {
  var cardContainer = document.getElementById('cardCarousel');
  var cards = document.querySelectorAll('.card');
  var isAnimating = false; // Flag to prevent overlapping animations
  var transitionHandled = false; // Flag to track whether the transitionend event has been handled

  function slideAndRotate() {
    if (isAnimating || transitionHandled) return;
    isAnimating = true;

    // Slide all cards and the entire row to the left
    cards.forEach(function (card, index) {
      var marginRight = parseInt(getComputedStyle(card).marginRight);
      card.style.transition = 'transform 0.5s ease-in-out';
      card.style.transform = 'translateX(' + (-1 * (card.offsetWidth + marginRight)) + 'px)';
    });

    // cardContainer.style.transition = 'transform 0.5s ease-in-out';
    // cardContainer.style.transform = 'translateX(-16px)';

    // After the last card finishes transitioning, move the first card to the last position
    cards[0].addEventListener('transitionend', handleTransition);

    function handleTransition() {
      if (!transitionHandled) {
        transitionHandled = true;
        setTimeout(function () {
          cardContainer.appendChild(cardContainer.firstElementChild);
          cards.forEach(function (card) {
            card.style.transition = 'none';
            card.style.transform = 'translateX(0)';
          });
          cardContainer.style.transition = 'none';
          cardContainer.style.transform = 'translateX(0)';
          isAnimating = false;
          transitionHandled = false; // Reset the flag for the next button click
        }, 50); // Adjust the delay as needed
      }
      cards[0].removeEventListener('transitionend', handleTransition);
    }
  }

  // Attach the event listener to the button
  var nextCardButton = document.getElementById('nextCardButton');
  if (nextCardButton) {
    nextCardButton.addEventListener('click', function () {
      slideAndRotate();
    });
  }
});
const subscribeButton = document.getElementById('hero_subscribeButton');
const emailInput = document.getElementById('hero_emailInput');

if (subscribeButton) subscribeButton.addEventListener('click', () => {
  const email = emailInput.value;
  console.log("Email:", email); // Log the email value

  // Send the event to outrun.js
  outrun.stream("form_submitted", { email: email });
  console.log("Outrun event streamed"); // Log that the event was sent

  // Redirect to /thank-you
  setTimeout(() => { // Delay the redirect slightly
    window.location.href = '/thank-you';
    console.log("Redirecting to /thank-you"); // Log the redirect
  }, 1000); 
});
const subscribeBannerButton = document.getElementById('subscribebanner_subscribeButton');
const subscribeBanneremailInput = document.getElementById('subscribebanner_emailInput');

if (subscribeBannerButton) subscribeBannerButton.addEventListener('click', () => {
  const email = subscribeBanneremailInput.value;
  console.log("Email:", email); // Log the email value

  // Send the event to outrun.js
  outrun.stream("form_submitted", { email: email });
  console.log("Outrun event streamed"); // Log that the event was sent

  // Redirect to /thank-you
  setTimeout(() => { // Delay the redirect slightly
    window.location.href = '/thank-you';
    console.log("Redirecting to /thank-you"); // Log the redirect
  }, 1000); 
});
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
        apiKey: 'outrun-chat-widget-token-1772653365',
        streamId: '1b771da2-46d8-4345-8289-73c778b5781c',
        workspaceId: '69be3118-75e7-43a7-944a-303df92e17ca',
        autoTrack: ['click', 'hover', 'focus', 'blur', 'input', 'submit', 'page view'],
        endpoint: 'api.outrun.dev',
        debug: false
      });

      // Initialize live chat widget
      // Chat will only display if a support agent is attached to this website source
      outrun.chat.init({
        sourceId: '1b771da2-46d8-4345-8289-73c778b5781c',
        token: 'outrun-chat-widget-token-1772653365',
      });

    } catch (error) {
      console.error('Error initializing Outrun SDK:', error);
    }
  })();
