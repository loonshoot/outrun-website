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