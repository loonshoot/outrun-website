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

subscribeButton.addEventListener('click', () => {
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
